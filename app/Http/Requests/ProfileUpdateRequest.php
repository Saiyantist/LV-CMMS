<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'name' => ['required', 'string', 'max:255'],
            'first_name' => 'required|string|max:20',
            'last_name' => 'required|string|max:40',
            // 'birth_date' => 'required|date|max:255',
            'gender' => 'required|string|max:255',
            'contact_number' => 'required|integer|digits:10',
            'staff_type' => [
                Rule::when(fn() => $this->user()->staff_type !== null, ['required', 'in:teaching,non-teaching']),
            ],
            'department_id' => [
                Rule::when(fn() => $this->user()->staff_type !== null, ['required', 'exists:departments,id']),
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }
}
