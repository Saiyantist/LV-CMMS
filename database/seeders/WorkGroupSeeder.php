<?php

namespace Database\Seeders;

use App\Models\WorkGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workGroups = [
            ['name' => 'Aircon Specialist'],
            ['name' => 'Painter'],
            ['name' => 'Carpenter'],
            ['name' => 'Plumber'],
            ['name' => 'Electrician'],
            ['name' => 'Welder'],
            ['name' => 'Repairman'],
        ];
        foreach ($workGroups as $workGroup) {
            WorkGroup::create($workGroup);
        }
    }
}
