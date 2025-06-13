<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Department;
use App\Models\User;
use App\Models\WorkGroup;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register',[
            'departments' => Department::all(),
        ]);
    }

    public function createInternal(): Response
{       
    return Inertia::render('Auth/InternalRegistration', [
        'departments' => Department::all(),
        'work_groups' => WorkGroup::all(),
    ]);
}

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        // Create the new user
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            // 'birth_date' => $request->birth_date,
            'gender' => $request->gender,
            'contact_number' => '0' . $request->contact_number,
            'staff_type' => $request->staff_type ?? null,
            'department_id' => $request->department_id ?? null,
            'work_group_id' => $request->work_group_id ?? null,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
