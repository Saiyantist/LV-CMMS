<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class StrongPassword implements Rule
{
    protected array $errors = [];

    public function passes($attribute, $value): bool
    {
        $this->errors = [];

        if (!preg_match('/(?=.*[a-z])(?=.*[A-Z])/', $value)) {
            $this->errors[] = 'The password must contain at least one uppercase and one lowercase letter.';
        }

        if (!preg_match('/(?=.*[-+_?@#%.,~])/', $value)) {
            $this->errors[] = 'The password must contain at least one special character (-+_?@#%.,~).';
        }

        if (!preg_match('/(?=.*\d)/', $value)) {
            $this->errors[] = 'The password must contain at least one number.';
        }

        // Only passes if no errors
        return count($this->errors) === 0;
    }

    public function message(): string
    {
        return implode(' ', $this->errors);
    }
}
