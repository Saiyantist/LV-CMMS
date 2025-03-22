<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Redirect;

class UserRoleController extends Controller
{
    public function index()
    {
        // $users = User::with('roles')->get();
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'birth_date' => $user->birth_date && !empty($user->birth_date) 
                ? (Str::startsWith($user->birth_date, 'eyJpdiI6') ? Crypt::decryptString($user->birth_date) : $user->birth_date) 
                : null,
                'contact_number' => $user->contact_number && !empty($user->contact_number) 
                ? (Str::startsWith($user->contact_number, 'eyJpdiI6') ? Crypt::decryptString($user->contact_number) : $user->contact_number) 
                : null,
                'email' => $user->email,
                'roles' => $user->roles,
            ];
        });
        
        // dd($users);

        return inertia('Admin/UserManagement', [
            'users' => $users,
            'roles' => Role::all(),
            'auth' => ['user' => auth()->user()]
        ]);
        // return inertia('Admin/UserManagement', [
        //     'users' => User::with('roles')->get(),
        //     'roles' => Role::all(),
        //     'auth' => ['user' => auth()->user()]
        // ]);
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
        $user->syncRoles([$request->role]);

        return $this->index();
    }
    
    public function removeRole(User $user)
    {
        $user->roles()->detach();
        return $this->index();
    }
}
