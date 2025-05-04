<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $emailRules = [
            'required',
            'string',
            'lowercase',
            'email',
            'max:255',
            'unique:users,email',
        ];
    
        // Apply domain-specific rule based on route
        if ($this->is('access.registration-internal-user-registration')) {
            $emailRules[] = 'regex:/^[a-zA-Z0-9._%+-]+@laverdad\.edu\.ph$/i';
        }
    
        return [
            'first_name' => 'required|string|max:20',
            'last_name' => 'required|string|max:40',
            'birth_date' => 'required|date|max:255',
            'gender' => 'required|string|max:255',
            'contact_number' => 'required|integer|digits:10',
            'staff_type' => ['required', 'in:teaching,non-teaching'],
            'department_id' => ['required', 'exists:departments,id'],
            'email' => $emailRules,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    public function messages(): array
    {
        return [
            'email.regex' => 'The provided email address is not a valid La Verdad email address.',
        ];
    }
}
