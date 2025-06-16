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
            "Computer Laboratory A",
            "Computer Laboratory B",
            "EFS Classroom(s) Room #:",
            "LVCC Grounds",
            "LVCC  Main Lobby",
            "Elementary & High School Library",
            "Basketball Court",
        ];

        $internalDepartments = [
            "Basic Ed - Primary",
            "Basic Ed - Intermediate",
            "Basic Ed - Homeschool",
            "Basic Ed - Junior High School",
            "Basic Ed - English Department",
            "Basic Ed - AP Department",
            "Basic Ed - Math Department",
            "Basic Ed - MAPEH Department",
            "Basic Ed - Social Science Department",
            "Basic Ed - Senior High School - ABM",
            "Basic Ed - Senior High School - STEM",
            "Basic Ed - Senior High School - GAS",
            "Basic Ed - Senior High School - ICT",
            "Basic Ed - Senior High School - Culinary",
            "Academics, GMRC",
            "Higher Ed - BS in Information Systems",
            "Higher Ed - Associate in Computer Technology",
            "Higher Ed - BS in Accountancy",
            "Higher Ed - BS in Accounting Information Systems",
            "Higher Ed - BS in Social Work",
            "Organization - Association of ICT Majors (AIM)",
            "Organization - Junior Philippine Institute of Accountants (JPIA)",
            "Organization - Junior Social Workers' Association of the Philippines (JSWAP)",
            "Organization - Broadcasting Students Society (BSS)",
            "Organization - Supreme Student Government (SSG)",
            "Organization - LV Dance Troupe",
            "Registrar Office",
            "Communications Office",
            "Human Resource Department (HR)",
            "Guidance Office",
            "Prefect Student Affairs and Services (PSAS)",
            "General Services Department (GSD) - Safety & Security",
            "Data Privacy Office (DPO)",
            "Student Publication Office",
        ];

        $externalDepartments = [
            "MCGI Music Ministry",
            "MCGI Teatro Kristiano",
            "MCGI Orchestra",
            "Teatro Kristiano",
            "MMC Events Committee",
            "Disaster Response and Rescue Team (DRRT)",
        ];

        $services = [
            // GENERAL ADMINISTRATIVE SERVICES
            "Maintainer Time",
            "Lighting",
            "Tables",
            "Bathroom Cleaning",
            "Chairs",
            "Aircon",
            // COMMUNICATIONS OFFICE
            "Speaker",
            "Microphone",
            "Audio Mixer",
            "Extension Cord",
            "Projector",
            "HDMI",
            "Photographer",
            "Event Poster",
            "Event Reel",
            "Event Documentation",
            // MANAGEMENT INFORMATION SYSTEMS
            "Internet",
            // CAMPUS SAFETY AND SECURITY
            "Marshal",
            "LV DRRT",
        ];

        // Always create at least one Approved (On Going) booking for today
        static $hasOnGoing = false;
        if (!$hasOnGoing) {
            $hasOnGoing = true;
            $status = 'Approved';
            $start = new \DateTime(); // today
            $duration = rand(0, 3);
            $end = (clone $start)->modify("+$duration days");
        } else {
            $status = $this->faker->randomElement(['Approved', 'Completed', 'Cancelled', 'Pending', 'Rejected']);
            if ($status === 'Completed') {
                // Set start and end in the past
                $start = $this->faker->dateTimeBetween('-2 months', '-7 days');
                $duration = rand(0, 3);
                $end = (clone $start)->modify("+$duration days");
            } else {
                // Future or present event
                $start = $this->faker->dateTimeBetween('now', '+2 months');
                $duration = rand(0, 3);
                $end = (clone $start)->modify("+$duration days");
            }
        }

        // Venue: can be multiple, one, or nullable
        $venueSeedType = rand(1, 3);
        if ($venueSeedType === 1) {
            // Single venue
            $venue = [$this->faker->randomElement($venueNames)];
        } elseif ($venueSeedType === 2) {
            // Multiple venues
            $venue = collect($venueNames)->shuffle()->take(rand(2, 4))->values()->toArray();
        } else {
            // Nullable
            $venue = [];
        }

        // Generate a logical time range (end time not earlier than start time)
        $startTime = $this->faker->time('H:i');
        $startDateTime = \DateTime::createFromFormat('H:i', $startTime);
        $endDateTime = (clone $startDateTime)->modify('+' . rand(1, 8) . ' hours');
        $endTime = $endDateTime->format('H:i');

        // Randomly pick internal or external department
        $departmentType = $this->faker->randomElement(['internal', 'external']);
        $department = $departmentType === 'internal'
            ? $this->faker->randomElement($internalDepartments)
            : $this->faker->randomElement($externalDepartments);

        // Random participants (group/organization names)
        $groupNames = [
            "LVCC Faculty",
            "College Students",
            "Student Council",
            "MCGI Music Ministry",
            "LVCC Volleyball Team",
            "Parents",
            "Alumni Association",
            "Guest Speakers",
            "MIS Department",
            "Science Club",
            "All Employees",
            "Selected Students",
            "Campus Security Team",
            "External Partners",
            "Event Organizers",
            "All Participants",
            "Workshop Attendees",
            "Performers",
            "Volunteers",
            "Committee Members",
        ];

        // Pick 1-5 random group names for participants
        $participants = collect($groupNames)
            ->shuffle()
            ->take(rand(1, 5))
            ->implode(', ');

        // Random requested services (pick 1-5)
        $requestedServices = collect($services)
            ->shuffle()
            ->take(rand(1, 19))
            ->values()
            ->toArray();

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->catchPhrase(3),
            'venue' => $venue ? json_encode($venue) : null,
            'department' => $department,
            'participants' => $participants,
            'number_of_participants' => $this->faker->numberBetween(1, 999),
            'description' => $this->faker->realText(100),
            'requested_services' => json_encode($requestedServices),
            'status' => $status,
            'event_start_date' => $start->format('Y-m-d'),
            'event_end_date' => $end->format('Y-m-d'),
            'event_start_time' => $startTime,
            'event_end_time' => $endTime,
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}