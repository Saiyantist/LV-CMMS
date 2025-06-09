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
            'first_name' => 'Angelo', 'last_name' => 'Delos Santos (SA)',
            'gender' => 'male',
            'contact_number' => '09471847021',
            'email' => 'angelo.delossantos000@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('secret'),
            'staff_type' => 'non-teaching',
            'department_id' => 1,
            ])->assignRole('super_admin');

        User::create([
            'first_name' => 'Angelo', 'last_name' => 'Delos Santos (LV)',
            'gender' => 'male',
            'contact_number' => '09123456789',
            'email' => 'jeromedelossantos@student.laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('secret'),
            'staff_type' => 'non-teaching',
            'department_id' => 1,
            ])->assignRole('gasd_coordinator');

        User::create([
            'first_name' => 'Joshua', 'last_name' => 'Allador',
            'gender' => 'male',
            'contact_number' => '09205979015',
            'email' => 'joshuaallador@student.laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('secret'),
            'staff_type' => 'non-teaching',
            'department_id' => 1,
        ])->assignRole('communications_officer');

        // // Internal Requester
        // User::create([
        //     'first_name' => 'Internal', 'last_name' => 'Requester',
        //     'gender' => 'male',
        //     'contact_number' => '09202098397',
        //     'email' => 'internalrequester@laverdad.edu.ph',
        //     'email_verified_at' => now(),
        //     'password' => Hash::make('password'),
        //     'staff_type' => 'teaching',
        //     'department_id' => 9,
        // ])->assignRole('internal_requester');

        // Department Head
        User::create([
            'first_name' => 'Department', 'last_name' => 'Head',
            'gender' => 'male',
            'contact_number' => '09205979015',
            'email' => 'departmenthead@laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'staff_type' => 'non-teaching',
            'department_id' => 1,
            ])->assignRole('department_head');
            
        // Maintenance Personnel
        User::create([
            'first_name' => 'Maintenance', 'last_name' => 'Personnel',
            'gender' => 'male',
            'contact_number' => '09205979015',
            'email' => 'maintenancepersonnel@laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'staff_type' => 'maintenance_personnel',
            'work_group_id' => '7',
        ])->assignRole('maintenance_personnel');

        // External Requester
        User::create([
            'first_name' => 'External', 'last_name' => 'Requester',
            'gender' => 'male',
            'contact_number' => '09053020251',
            'email' => 'externalrequester@laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ])->assignRole('external_requester');

        // Mr. Eric - GASD Coordinator
        User::create([
            'first_name' => 'Eric', 'last_name' => 'Bolaño',
            'gender' => 'male',
            'contact_number' => '09123456789',
            'email' => 'eric@laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'staff_type' => 'non-teaching',
            'department_id' => 2,
        ])->assignRole('gasd_coordinator');

        // Ms. Edyssa - Communications Officer
        User::create([
            'first_name' => 'Edyssa', 'last_name' => 'Belandres',
            'gender' => 'female',
            'contact_number' => '09234567890',
            'email' => 'edyssa@laverdad.edu.ph',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'staff_type' => 'non-teaching',
            'department_id' => 3,
        ])->assignRole('communications_officer');
    }
}
