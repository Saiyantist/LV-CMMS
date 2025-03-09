<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WorkOrder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        User::create([
            'first_name' => 'Joshua', 'last_name' => 'Allador',
            'birth_date' => '1999-01-01', 'gender' => 'male',
            'contact_number' => '09205979015',
            'email' => 'jshallador19@gmail.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'first_name' => 'Angelo', 'last_name' => 'Delos Santos',
            'birth_date' => '1999-01-01', 'gender' => 'male',
            'contact_number' => '09471847021',
            'email' => 'angelo.delossantos000@gmail.com',
            'password' => Hash::make('password'),
        ]);

        // WorkOrder::factory(20)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
