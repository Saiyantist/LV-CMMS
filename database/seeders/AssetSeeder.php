<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assetNames = [
            'HVAC System', 'Elevator', 'Fire Alarm System', 'Water Pump',
            'Backup Generator', 'Security Camera', 'Access Control System', 'Intercom System',
            'Sprinkler System', 'Electrical Panel', 'Boiler', 'Water Heater',
            'Ventilation Fans', 'Emergency Exit Lights', 'Plumbing System', 'Parking Gate',
            'UPS System', 'Smoke Detectors', 'CCTV Recorder', 'Building Management System'
        ];

        foreach ($assetNames as $name) {
            Asset::create([
                'name' => $name,
                'specification_details' => fake()->sentence(5),
                'date_acquired' => fake()->date(),
                'status' => fake()->randomElement(['Functional', 'Failed', 'Under Maintenance', 'End of Useful Life']),
                'location_id' => Location::inRandomOrder()->first()->id ?? null, // Assign random location if exists
                // 'preventive_maintenance_interval_value' => fake()->numberBetween(1, 12),
                // 'preventive_maintenance_interval_unit' => fake()->randomElement(['day', 'week', 'month', 'year']),
                'last_maintained_at' => now()->subDays(fake()->numberBetween(0, 365)),
                // 'qr_code' => Str::uuid(),
            ]);
        }
    }
}
