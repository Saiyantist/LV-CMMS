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
            ['name' => 'Management Information Systems'],
            ['name' => 'General Admin Services'],
            ['name' => 'Communications Office'],
            ['name' => 'Finance'],
            ['name' => 'HR'],
            ['name' => 'PSAS'],
            ['name' => 'Accountng'],
            ['name' => 'IT'],
            ['name' => 'Library'],
            ['name' => 'College'],
            ['name' => 'JHS'],
            ['name' => 'SHS'],
            ['name' => 'Elementary'],
            ['name' => 'Primary'],
            ['name' => 'No Department'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
