<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EventService;

class EventServiceSeeder extends Seeder
{
    public function run(): void
    {
        EventService::factory(30)->create();
    }
}