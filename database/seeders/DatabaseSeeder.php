<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WorkOrder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(DepartmentSeeder::class);
        $this->call(WorkGroupSeeder::class);
        $this->call(RolePermissionSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(LocationSeeder::class);
        $this->call(AssetSeeder::class);
        $this->call(EventServiceSeeder::class);
        User::factory(50)->create();
        
        WorkOrder::factory(300)->create();
        $this->call(AssetMaintenanceHistorySeeder::class);
    }
}
