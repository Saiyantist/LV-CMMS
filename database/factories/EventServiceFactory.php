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

        // Generate a logical date range
        $start = $this->faker->dateTimeBetween('now', '+2 months');
        $duration = rand(0, 3); // event lasts 1-4 days
        $end = (clone $start)->modify("+$duration days");

        // Generate a logical time range
        $startTime = $this->faker->time('H:i');
        // Add 1 to 8 hours to start time for end time
        $startDateTime = \DateTime::createFromFormat('H:i', $startTime);
        $endDateTime = (clone $startDateTime)->modify('+' . rand(1, 8) . ' hours');
        $endTime = $endDateTime->format('H:i');

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->sentence(3),
            'venue' => json_encode([$this->faker->randomElement($venueNames)]),
            'status' => $this->faker->randomElement(['Approved', 'Completed', 'In Progress', 'Cancelled', 'Not Started', 'Pending', 'Rejected' ]),
            'event_start_date' => $start->format('Y-m-d'),
            'event_end_date' => $end->format('Y-m-d'),
            'event_start_time' => $startTime,
            'event_end_time' => $endTime,
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            // ...other fields
        ];
    }
}