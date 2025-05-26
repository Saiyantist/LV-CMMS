<?php
namespace Database\Factories;

use App\Models\EventService;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventServiceFactory extends Factory
{
    protected $model = EventService::class;

    public function definition()
    {
        $venueNames = [
            "Auditorium",
            "Auditorium Lobby",
            "College Library",
            "Meeting Room",
            "Training Room A",
            "Computer Laboratory A",
            "Computer Laboratory B",
            "EFS Classroom(s) Room #:",
            "LVCC Grounds",
            "LVCC  Main Lobby",
            "Elementary & High School Library",
            "Basketball Court",
        ];

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->sentence(3),
            'venue' => $this->faker->randomElement($venueNames), // Use the correct venue names
            'event_date' => $this->faker->date(),
            'status' => $this->faker->randomElement(['Completed', 'In Progress', 'Cancelled', 'Not Started']),
            'time' => $this->faker->time(),
            // ...other fields
        ];
    }
}