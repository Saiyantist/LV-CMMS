<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'Management Information Systems', 'type' => 'non-teaching'],
            ['name' => 'General Admin Services', 'type' => 'non-teaching'],
            ['name' => 'Communications Office', 'type' => 'non-teaching'],
            ['name' => 'Finance', 'type' => 'non-teaching'],
            ['name' => 'HR', 'type' => 'non-teaching'],
            ['name' => 'PSAS', 'type' => 'non-teaching'],
            ['name' => 'Accounting', 'type' => 'non-teaching'],
            ['name' => 'IT', 'type' => 'non-teaching'],
            ['name' => 'Library', 'type' => 'non-teaching'],
            ['name' => 'College', 'type' => 'teaching'],
            ['name' => 'JHS', 'type' => 'teaching'],
            ['name' => 'SHS', 'type' => 'teaching'],
            ['name' => 'Elementary', 'type' => 'teaching'],
            ['name' => 'Primary', 'type' => 'teaching'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
