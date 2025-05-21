<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Rules\StrongPassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
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

        $passwordRules = [
            'required',
            'confirmed',
            'min:8',
            new StrongPassword(),
        ];
    
        /** For internal registration */
        if ($this->routeIs('register.internal')) {            
            $emailRules[] = 'regex:/^[a-zA-Z0-9._%+-]+@laverdad\.edu\.ph$/i';
            
            return [
                'first_name' => 'required|string|max:20',
                'last_name' => 'required|string|max:40',
                // 'birth_date' => 'required|date|max:255',
                'gender' => 'required|string|max:255',
                'contact_number' => 'required|integer|digits:10',
                'staff_type' => ['required', 'in:teaching,non-teaching'],
                'department_id' => ['required', 'exists:departments,id'],
                'email' => $emailRules,
                'password' => $passwordRules,
            ];
        }

        /** For external registration */
        if ($this->routeIs('register.external')) {
            return [
                'first_name' => 'required|string|max:20',
                'last_name' => 'required|string|max:40',
                'gender' => 'required|string|max:255',
                'contact_number' => 'required|integer|digits:10',
                'email' => $emailRules,
                'password' => $passwordRules,
            ];
        }
        
        /** Fallback */
        return [
            'first_name' => 'required|string|max:20',
            'last_name' => 'required|string|max:40',
            // 'birth_date' => 'required|date|max:255',
            'gender' => 'required|string|max:255',
            'contact_number' => 'required|integer|digits:10',
            'staff_type' => ['required', 'in:teaching,non-teaching'],
            'department_id' => ['required', 'exists:departments,id'],
            'email' => $emailRules,
            'password' => $passwordRules,
        ];
    }

    public function messages(): array
    {
        return [
            'email.regex' => 'The provided email address is not a valid La Verdad email address.',
            // 'birth_date.required' => 'The birth date is required for internal registration.',
            'staff_type.required' => 'The staff type is required for internal registration.',
            'department_id.required' => 'The department is required for internal registration.',
            'contact_number.integer' => 'The contact number is should start with 9.',
            'password.upper_lower' => 'The password must contain at least one uppercase and one lowercase letter.',
            'password.special_char' => 'The password must contain at least one special character (-+_?@#%.,~).',
            'password.number' => 'The password must contain at least one number.',
        ];
    }
}
