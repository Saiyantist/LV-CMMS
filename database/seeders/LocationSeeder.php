<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations =  [
            'Building Entrance',
            'Main Lobby',
            'End Stairs - DSR Wing',
            'End Stairs - EFS Wing',
            'Middle Stairs - DSR Wing', // up to 3rd floor
            'Middle Stairs - EFS Wing', // up to 4th floor
            'DSR 201', 'DSR 202', 'DSR 203', 'DSR 204', 'DSR 205', 'DSR 206',
            'DSR 301', 'DSR 302', 'DSR 303', 'DSR 304', 'DSR 305', 'DSR 306', 'DSR 307', 'DSR 308', 'DSR 309', 'DSR 310',            
            'EFS 201', 'EFS 202', 'EFS 203', 'EFS 204', 'EFS 205', 'EFS 206', 'EFS 207', 'EFS 208', 'EFS 209', 'EFS 210', 'EFS 211', 'EFS 212', 'EFS 213', 'EFS 214',
            'EFS 301', 'EFS 302', 'EFS 303', 'EFS 304', 'EFS 305', 'EFS 306', 'EFS 307', 'EFS 308', 'EFS 309', 'EFS 310', 'EFS 311', 'EFS 312',
            'EFS 401', 'EFS 402', 'EFS 403', 'EFS 404', 'EFS 405', 'EFS 406', 'EFS 407', 'EFS 408', 'EFS 409', 'EFS 410',
            'School Canteen',
            'LV Grounds', 'Volleyball Court',
            'Taekwondo Area',
            'Physics Room',
            'IC Laboratory',
            'Stockroom',
            'School Clinic',
            'College Faculty',
            'Dean\'s Office',
            'Finance Office',
            'Computer Laboratory A', 'Computer Laboratory B',
            'Data Privacy Office',
            'Registrar Office',
            'Admissions Office',
            'MIS  Office',
            'PSAS Office',
            'Guidance Office',
            'ITSS Office',
            'College Library',
            'Basic Education Library',
            'Chess Room',
            'TLE Room',
            'Auditorium', 'Auditorium Lobby',
        ];

        foreach ($locations as $location) {
            Location::create([ "name" => $location]);
        }
    }
}
