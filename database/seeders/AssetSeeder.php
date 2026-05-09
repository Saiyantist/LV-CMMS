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
        $assets = [
            ['name' => 'HVAC System', 'specification_details' => 'Central air conditioning system with 5-ton capacity, 16 SEER rating, and smart thermostat integration'],
            ['name' => 'Elevator', 'specification_details' => 'Passenger elevator with 1000kg capacity, 8 floors, emergency backup power, and safety sensors'],
            ['name' => 'Fire Alarm System', 'specification_details' => 'Addressable fire detection system with smoke and heat sensors, manual call points, and central control panel'],
            ['name' => 'Water Pump', 'specification_details' => 'Submersible water pump with 2HP motor, 100ft head capacity, and automatic pressure control'],
            ['name' => 'Backup Generator', 'specification_details' => 'Diesel-powered 100kVA generator with automatic transfer switch and weekly self-test feature'],
            ['name' => 'Security Camera', 'specification_details' => '4K IP security camera with night vision, motion detection, and 360-degree rotation capability'],
            ['name' => 'Access Control System', 'specification_details' => 'Biometric and RFID access control system with 1000 user capacity and audit trail logging'],
            ['name' => 'Intercom System', 'specification_details' => 'IP-based intercom system with video calling, door release control, and mobile app integration'],
            ['name' => 'Sprinkler System', 'specification_details' => 'Wet pipe sprinkler system with 165°F activation temperature and 100 PSI operating pressure'],
            ['name' => 'Electrical Panel', 'specification_details' => 'Main distribution panel with 400A capacity, 480V/3-phase power, and circuit breakers'],
            ['name' => 'Boiler', 'specification_details' => 'Gas-fired boiler with 500,000 BTU capacity, modulating burner, and digital controls'],
            ['name' => 'Air Purifier', 'specification_details' => 'HEPA air purifier with UV-C sterilization, activated carbon filter, and 500 sq ft coverage'],
            ['name' => 'Inverter Air Conditioner', 'specification_details' => '1.5 ton inverter AC with R32 refrigerant, 5-star energy rating, and WiFi connectivity'],
            ['name' => 'Ventilation Fan', 'specification_details' => 'Industrial exhaust fan with 2000 CFM capacity, IP54 rating, and thermal overload protection'],
            ['name' => 'Emergency Exit Light', 'specification_details' => 'LED emergency light with 3-hour battery backup and self-testing feature'],
            ['name' => 'Plumbing System', 'specification_details' => 'Complete plumbing system with copper piping, pressure reducing valves, and backflow prevention'],
            ['name' => 'Parking Gate', 'specification_details' => 'Automatic barrier gate with RFID reader, safety sensors, and traffic light integration'],
            ['name' => 'UPS System', 'specification_details' => 'Online UPS with 3000VA capacity, pure sine wave output, and LCD display'],
            ['name' => 'Smoke Detector', 'specification_details' => 'Photoelectric smoke detector with 10-year battery life and interconnect capability'],
            ['name' => 'CCTV', 'specification_details' => 'HD CCTV system with 4 cameras, 1TB storage, and remote viewing capability'],
            ['name' => 'Building Management System', 'specification_details' => 'Integrated BMS with HVAC, lighting, and security system control capabilities'],
            ['name' => 'Fire Extinguisher', 'specification_details' => 'ABC type fire extinguisher with 10lb capacity and pressure gauge'],
            ['name' => 'Vacuum Cleaner', 'specification_details' => 'Commercial vacuum cleaner with 2000W motor and HEPA filtration system'],
            ['name' => 'Carpet Cleaning Machine', 'specification_details' => 'Professional carpet cleaner with 150 PSI pressure and dual tank system'],
            // Duplicate entries with consistent specifications
            ['name' => 'Inverter Air Conditioner', 'specification_details' => '1.5 ton inverter AC with R32 refrigerant, 5-star energy rating, and WiFi connectivity'],
            ['name' => 'Inverter Air Conditioner', 'specification_details' => '1.5 ton inverter AC with R32 refrigerant, 5-star energy rating, and WiFi connectivity'],
            ['name' => 'Inverter Air Conditioner', 'specification_details' => '1.5 ton inverter AC with R32 refrigerant, 5-star energy rating, and WiFi connectivity'],
            ['name' => 'Ventilation Fan', 'specification_details' => 'Industrial exhaust fan with 2000 CFM capacity, IP54 rating, and thermal overload protection'],
            ['name' => 'Ventilation Fan', 'specification_details' => 'Industrial exhaust fan with 2000 CFM capacity, IP54 rating, and thermal overload protection'],
            ['name' => 'Ventilation Fan', 'specification_details' => 'Industrial exhaust fan with 2000 CFM capacity, IP54 rating, and thermal overload protection'],
            ['name' => 'Smoke Detector', 'specification_details' => 'Photoelectric smoke detector with 10-year battery life and interconnect capability'],
            ['name' => 'Smoke Detector', 'specification_details' => 'Photoelectric smoke detector with 10-year battery life and interconnect capability'],
            ['name' => 'Smoke Detector', 'specification_details' => 'Photoelectric smoke detector with 10-year battery life and interconnect capability'],
            ['name' => 'CCTV', 'specification_details' => 'HD CCTV system with 4 cameras, 1TB storage, and remote viewing capability'],
            ['name' => 'CCTV', 'specification_details' => 'HD CCTV system with 4 cameras, 1TB storage, and remote viewing capability'],
            ['name' => 'Vacuum Cleaner', 'specification_details' => 'Commercial vacuum cleaner with 2000W motor and HEPA filtration system'],
            ['name' => 'Fire Extinguisher', 'specification_details' => 'ABC type fire extinguisher with 10lb capacity and pressure gauge'],
            ['name' => 'Fire Extinguisher', 'specification_details' => 'ABC type fire extinguisher with 10lb capacity and pressure gauge'],
            ['name' => 'Air Purifier', 'specification_details' => 'HEPA air purifier with UV-C sterilization, activated carbon filter, and 500 sq ft coverage'],
            ['name' => 'Water Pump', 'specification_details' => 'Submersible water pump with 2HP motor, 100ft head capacity, and automatic pressure control'],
            ['name' => 'Security Camera', 'specification_details' => '4K IP security camera with night vision, motion detection, and 360-degree rotation capability'],
            ['name' => 'Emergency Exit Light', 'specification_details' => 'LED emergency light with 3-hour battery backup and self-testing feature'],
        ];

        foreach ($assets as $asset) {
            Asset::create([
                'name' => $asset['name'],
                'specification_details' => $asset['specification_details'],
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
