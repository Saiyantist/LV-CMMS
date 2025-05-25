<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\WorkGroup;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;
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
        $lastName = fake()->lastName();
        $staffType = fake()->optional(0.75)->randomElement(['teaching', 'non-teaching', 'maintenance_personnel']);

        // Determine department_id based on staff_type
        $departmentId = null;
        if ($staffType === 'teaching') {
            $departmentId = Department::where('type', 'teaching')->inRandomOrder()->first()?->id;
        } elseif ($staffType === 'non-teaching') {
            $departmentId = Department::where('type', 'non-teaching')->inRandomOrder()->first()?->id;
        }

        // Determine work_group_id based on staff_type
        $workGroupId = null;
        if ($staffType === 'maintenance_personnel') {
            $workGroupId = WorkGroup::inRandomOrder()->first()?->id;
        }

        // Determine email domain based on staff_type
        $emailDomain = '@laverdad.edu.ph';
        if ($staffType === 'maintenance_personnel' || is_null($staffType)) {
            $emailDomain = fake()->randomElement(['@gmail.com', '@example.com', '@yahoo.com']);
        }

        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
            // 'birth_date' => fake()->date('Y-m-d','-21 years'),
            'gender' => fake()->randomElement(['male', 'female']),
            'contact_number' => '09' . fake()->randomNumber(9, true),
            'email' => Str::lower($firstName) . '.' . Str::lower($lastName) . $emailDomain,
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'staff_type' => $staffType,
            'department_id' => $departmentId,
            'work_group_id' => $workGroupId,
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
            if (is_null($user->staff_type) && is_null($user->department_id)) {
                // Assign external_requester role if both staff_type and department_id are null
                $role = Role::where('name', 'external_requester')->first();
                if ($role) {
                    $user->assignRole($role->name);
                }
            } elseif ($user->staff_type === 'maintenance_personnel') {
                // Assign maintenance_personnel role if staff_type is maintenance_personnel
                $role = Role::where('name', 'maintenance_personnel')->first();
                if ($role) {
                    $user->assignRole($role->name);
                }
            } else {
                $safeRoles = Role::all()->count() - 1; // 'super_admin' is the last record in the roles table, so I excluded it.
                $role = Role::find(rand(1, $safeRoles));

                if ($role) {
                    $user->assignRole($role->name);
                }
            }
        });
    }
}
