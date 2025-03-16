<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Nette\Utils\Random;
use Spatie\Permission\Models\Role;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $firstName = fake()->firstName();
        return [
            'first_name' => $firstName,
            'last_name' => fake()->lastName(),
            'birth_date' => fake()->date('Y-m-d','-21 years'),
            'gender' => fake()->randomElement(['male', 'female', 'rather not say']),
            'contact_number' => '09' . fake()->randomNumber(9, true),
            'email' => Str::lower($firstName) . '@laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'staff_type' => fake()->randomElement(['teaching', 'non-teaching']),
            'department_id' => Department::inRandomOrder()->first()?->id,
            // 'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function configure()
    {
        return $this->afterCreating(function ($user) {
            $safeRoles = Role::all()->count() - 1; // 'super_admin' is the last record in the roles table, so I excluded it.
            $role = Role::find(rand(1, $safeRoles));

            if ($role) {
                $user->assignRole($role->name);
            }
        });
    }
}
