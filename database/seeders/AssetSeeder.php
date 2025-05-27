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
            'Sprinkler System', 'Electrical Panel', 'Boiler', 'Air Purifier', 'Inverter Air Conditioner',
            'Ventilation Fan', 'Emergency Exit Light', 'Plumbing System', 'Parking Gate',
            'UPS System', 'Smoke Detector', 'CCTV', 'Building Management System',
            'Fire Extinguisher', 'Vacuum Cleaner', 'Carpet Cleaning Machine',
            'Inverter Air Conditioner', 'Inverter Air Conditioner', 'Inverter Air Conditioner',
            'Ventilation Fan', 'Ventilation Fan', 'Ventilation Fan',
            'Smoke Detector', 'Smoke Detector', 'Smoke Detector',
            'CCTV', 'CCTV', 'Vacuum Cleaner', 'Fire Extinguisher', 'Fire Extinguisher',
            'Air Purifier', 'Water Pump', 'Security Camera', 'Emergency Exit Light',
        ];

        foreach ($assetNames as $name) {
            Asset::create([
                'name' => $name,
                'specification_details' => fake()->sentence(5),
                'date_acquired' => $dateAcquired = fake()->dateTimeBetween('-3 years', 'now'),
                'status' => fake()->boolean(3) ? 'End of Useful Life' : fake()->randomElement(['Functional', 'Failed', 'Under Maintenance',]),
                'location_id' => Location::inRandomOrder()->first()->id ?? null, // Assign random location if exists
                // 'preventive_maintenance_interval_value' => fake()->numberBetween(1, 12),
                // 'preventive_maintenance_interval_unit' => fake()->randomElement(['day', 'week', 'month', 'year']),
                'last_maintained_at' => fake()->dateTimeBetween($dateAcquired, 'now'),
                // 'qr_code' => Str::uuid(),
            ]);
        }
    }
}
