<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Department;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            // Pass full user information to the profile edit page
            // GELO: Check if all of these is necessary, or baka profile_photo_url lang ang need maaipasa.
            // 'user' => $request->user()->only([
            //     'id',
            //     'first_name',
            //     'last_name',
            //     'contact',
            //     'number',
            //     'birthday',
            //     'gender',
            //     'staff_type',
            //     'department_id',
            //     'role',
            //     'profile_photo_url',
            // ]),
            // 'auth' => [
            //     'user' => $request->user()->only([
            //         'id', 'first_name', 'last_name', 'contact_number',
            //         'birth_date', 'gender', 'staff_type', 'department_id', 'email', 'roles'
            //     ]),
            // ],
            'departments' => Department::all(),
        ]);
    }


    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
