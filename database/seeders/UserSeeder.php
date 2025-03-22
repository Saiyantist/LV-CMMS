<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Joshua', 'last_name' => 'Allador',
            'birth_date' => '1999-01-01', 'gender' => 'male',
            'contact_number' => '09205979015',
            'email' => 'joshua@laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'staff_type' => 'non-teaching',
            'department_id' => 1,
        ])->assignRole('super_admin');

        User::create([
            'first_name' => 'Angelo', 'last_name' => 'Delos Santos',
            'birth_date' => '1999-01-01', 'gender' => 'male',
            'contact_number' => '09471847021',
            'email' => 'angelo@laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'staff_type' => 'non-teaching',
            'department_id' => 1,
        ])->assignRole('super_admin');

        // Mr. Eric
        User::create([
            'first_name' => 'Eric', 'last_name' => 'Bolaño',
            'birth_date' => '1999-01-01', 'gender' => 'male',
            'contact_number' => '09123456789',
            'email' => 'eric@laverdad.edu.ph',
            'password' => Hash::make('password'),
            'staff_type' => 'non-teaching',
            'department_id' => 2,
        ])->assignRole('gasd_coordinator');

        // Ms. Edyssa
        User::create([
            'first_name' => 'Edyssa', 'last_name' => 'Belandres',
            'birth_date' => '1999-01-01', 'gender' => 'female',
            'contact_number' => '09234567890',
            'email' => 'edyssa@laverdad.edu.ph',
            'password' => Hash::make('password'),
            'staff_type' => 'non-teaching',
            'department_id' => 3,
            ])->assignRole('communications_officer');
    }
}
