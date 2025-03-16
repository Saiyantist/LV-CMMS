<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;

class UserRoleController extends Controller
{
    public function index()
    {
        return inertia('Admin/UserManagement', [
            'users' => User::with('roles')->get(),
            'roles' => Role::all(),
            'auth' => ['user' => auth()->user()]
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
        $user->syncRoles([$request->role]);

        return $this->index();
    }
    
    public function removeRole(User $user)
    {
        $user->roles()->detach();
        return $this->index();
    }
}
