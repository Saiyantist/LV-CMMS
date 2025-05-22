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
            if($this->input('staff_type') !== 'maintenance_personnel') {
                $emailRules[] = 'regex:/^[a-zA-Z0-9._%+-]+@laverdad\.edu\.ph$/i';
            }

            $rules = [
                'first_name' => 'required|string|max:25|regex:/^[a-zA-Z]+$/',
                'last_name' => 'required|string|max:40|regex:/^[a-zA-Z]+$/',
                // 'birth_date' => 'required|date|max:255',
                'gender' => 'required|string|max:8',
                'contact_number' => ['required','string','regex:/^9\d{9}$/'],
                'staff_type' => ['required', 'in:teaching,non-teaching,maintenance_personnel'],
                'email' => $emailRules,
                'password' => $passwordRules,
            ];

            // Add conditional validation rules based on staff_type
            if ($this->input('staff_type') === 'maintenance_personnel') {
                $rules['department_id'] = ['nullable', 'exists:departments,id'];
                $rules['work_group_id'] = ['required', 'exists:work_groups,id'];
            } else {
                $rules['department_id'] = ['required', 'exists:departments,id'];
                $rules['work_group_id'] = ['nullable', 'exists:work_groups,id'];
            }

            return $rules;
        }
        
        /** For external registration */
        if ($this->routeIs('register.external')) {
            return [
                'first_name' => 'required|string|max:25|regex:/^[a-zA-Z]+$/',
                'last_name' => 'required|string|max:40|regex:/^[a-zA-Z]+$/',
                'gender' => 'required|string|max:8',
                'contact_number' => ['required','string','regex:/^9\d{9}$/'],
                'email' => $emailRules,
                'password' => $passwordRules,
            ];
        }
        
        /** Fallback */
        return [
            'first_name' => 'required|string|max:25|regex:/^[a-zA-Z]+$/',
            'last_name' => 'required|string|max:40|regex:/^[a-zA-Z]+$/',
            'gender' => 'required|string|max:8',
            'contact_number' => ['required','string','regex:/^9\d{9}$/'],
            'email' => $emailRules,
            'password' => $passwordRules,
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.regex' => 'The first name must contain only letters.',
            'last_name.regex' => 'The last name must contain only letters.',
            'email.regex' => 'The provided email address is not a valid La Verdad email address.',
            // 'birth_date.required' => 'The birth date is required for internal registration.',
            'staff_type.required' => 'The staff type is required for teaching or non-teaching staff.',
            'department_id.required' => 'The department is required for teaching or non-teaching staff.',
            'work_group_id.required_if' => 'The work group is required for maintenance personnel.',
            'contact_number.regex' => 'The contact number should start with 9 and must be 10 digits long.',
            'password.upper_lower' => 'The password must contain at least one uppercase and one lowercase letter.',
            'password.special_char' => 'The password must contain at least one special character (-+_?@#%.,~).',
            'password.number' => 'The password must contain at least one number.',
        ];
    }
}
