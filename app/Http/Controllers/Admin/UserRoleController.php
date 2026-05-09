<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Redirect;
use App\Mail\NewUserApproved;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserRoleController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                // 'birth_date' => $user->birth_date && !empty($user->birth_date) 
                // ? (Str::startsWith($user->birth_date, 'eyJpdiI6') ? Crypt::decryptString($user->birth_date) : $user->birth_date) 
                // : null,
                'contact_number' => $user->contact_number && !empty($user->contact_number) 
                ? (Str::startsWith($user->contact_number, 'eyJpdiI6') ? Crypt::decryptString($user->contact_number) : $user->contact_number) 
                : null,
                'email' => $user->email,
                'roles' => $user->roles,
                'department_id' => $user->department_id,
                'work_group_id' => $user->work_group_id,
                'staff_type' => $user->staff_type,
                'status' => ucwords($user->status),
                'created_at' => $user->created_at->format('Y-m-d H:i:s'),
            ];
        });
        
        return inertia('Admin/UserManagement', [
            'users' => $users,
            'roles' => Role::all(),
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        // Prevent currently authenticated Super Admin from modifying their own role
        if (Auth::id() === $user->id && $user->hasRole('super_admin')) {
            return response()->json(['message' => 'You cannot modify your own role.'], 403);
        }

        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        // Assign new role and remove previous roles
        DB::transaction(function () use ($request, $user) {
            // Remove all existing roles
            $user->roles()->detach();
            
            // Mail the user of approval of their account
            $userData = ['role' => Str::title(str_replace('_', ' ', $user->roles->pluck('name')->first()))];
            Mail::to($user->email)->send(new NewUserApproved($userData));
            
            // Attach the new role
            $role = Role::where('name', $request->role)->first();
            $user->roles()->attach($role);

            // Update user status to approved
            $user->update(['status' => 'approved']);
        });

        return redirect()->route('admin.manage-roles')->with('success', 'User role updated successfully.');
    }

    public function removeRole(User $user)
    {
        DB::transaction(function () use ($user) {
            // Remove all roles
            $user->roles()->detach();
            
            // Update user status to rejected
            $user->update(['status' => 'rejected']);
        });

        return redirect()->route('admin.manage-roles')->with('success', 'User role removed successfully.');
    }

    public function approveUser(Request $request, User $user)
    {
        $isInternal = $user->department_id || $user->work_group_id || $user->staff_type;

        if ($isInternal) {
            $request->validate([
                'role' => 'required|string|exists:roles,name',
            ]);
        }

        DB::transaction(function () use ($request, $user, $isInternal) {
            // Remove any existing roles
            $user->roles()->detach();

            // Assign the appropriate role
            if ($isInternal) {
                $role = Role::where('name', $request->role)->first();
                $user->roles()->attach($role);
            } else {
                $role = Role::where('name', 'external_requester')->first();
                $user->roles()->attach($role);
            }

            // Update user status to approved
            $user->update(['status' => 'approved']);

            // Send approval email
            $userData = ['role' => Str::title(str_replace('_', ' ', $role->name))];
            Mail::to($user->email)->send(new NewUserApproved($userData));
        });

        return redirect()->route('admin.manage-roles')->with('success', 'User approved successfully.');
    }

    public function rejectUser(User $user)
    {
        DB::transaction(function () use ($user) {
            // Remove all roles if any
            $user->roles()->detach();
            
            // Update user status to rejected
            $user->update(['status' => 'rejected']);
        });

        return redirect()->route('admin.manage-roles')->with('success', 'User rejected successfully.');
    }

    public function removeAccess(User $user)
    {
        if ($user->status !== 'approved') {
            return redirect()->route('admin.manage-roles')->with('error', 'Can only remove access from approved users.');
        }

        DB::transaction(function () use ($user) {
            // Remove all roles
            $user->roles()->detach();
            
            // Update user status to rejected
            $user->update(['status' => 'rejected']);
        });

        return redirect()->route('admin.manage-roles')->with('success', 'User access removed successfully.');
    }
}
