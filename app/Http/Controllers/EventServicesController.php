<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EventServicesController extends Controller
{
    public function index()
    {
        $calendarEvents = [
            1 => [
                [
                    "title" => "Auditorium",
                    "time" => "6:00 AM to 12 NN",
                    "color" => "bg-red-800",
                ],
            ],
            2 => [
                [
                    "title" => "LVCC Grounds",
                    "time" => "6:00 AM to 12 NN",
                    "color" => "bg-red-800",
                ],
            ],
            3 => [
                [
                    "title" => "Auditorium Lobby",
                    "time" => "1:00 PM to 4:00 PM",
                    "color" => "bg-orange-500",
                ],
            ],
            4 => [
                [
                    "title" => "EFS 301",
                    "time" => "1:00 PM to 4:00 PM",
                    "color" => "bg-orange-500",
                ],
            ],
            7 => [
                [
                    "title" => "Auditorium",
                    "time" => "6:00 AM to 12 NN",
                    "color" => "bg-red-800",
                ],
            ],
            9 => [
                [
                    "title" => "DSR 309",
                    "time" => "1:00 PM to 4:00 PM",
                    "color" => "bg-orange-500",
                ],
            ],
            16 => [
                [
                    "title" => "DSR 309",
                    "time" => "6:00 AM to 12 NN",
                    "color" => "bg-orange-500",
                ],
                [
                    "title" => "Meeting Room",
                    "time" => "1:00 PM to 4:00 PM",
                    "color" => "bg-red-800",
                ],
            ],
            17 => [
                [
                    "title" => "Elementary & High School Library",
                    "time" => "6:00 AM to 12 NN",
                    "color" => "bg-orange-500",
                ],
            ],
            14 => [
                [
                    "title" => "Main Lobby",
                    "time" => "1:00 PM to 4:00 PM",
                    "color" => "bg-red-800",
                ],
            ],
            22 => [
                [
                    "title" => "College Library",
                    "time" => "6:00 AM to 12 NN",
                    "color" => "bg-red-800",
                ],
            ],
            24 => [
                [
                    "title" => "Basketball Court",
                    "time" => "6:00 AM to 12 NN",
                    "color" => "bg-orange-500",
                ],
            ],
        ];

        $listEvents = [
            [
                "id" => "1",
                "date" => "March 02, 2025",
                "venue" => "DSR 401",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Completed",
            ],
            [
                "id" => "2",
                "date" => "March 02, 2025",
                "venue" => "DSR 402",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "In Progress",
            ],
            [
                "id" => "3",
                "date" => "March 02, 2025",
                "venue" => "MIS Office",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Cancelled",
            ],
            [
                "id" => "4",
                "date" => "March 02, 2025",
                "venue" => "Registrar Office",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Not Started",
            ],
            [
                "id" => "5",
                "date" => "March 02, 2025",
                "venue" => "CR DSR 3rd Floor",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Not Started",
            ],
            [
                "id" => "6",
                "date" => "March 02, 2025",
                "venue" => "DSR 401",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Not Started",
            ],
            [
                "id" => "7",
                "date" => "March 02, 2025",
                "venue" => "DSR 401",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Not Started",
            ],
            [
                "id" => "8",
                "date" => "March 02, 2025",
                "venue" => "DSR 401",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Not Started",
            ],
            [
                "id" => "9",
                "date" => "March 02, 2025",
                "venue" => "DSR 401",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Not Started",
            ],
            [
                "id" => "10",
                "date" => "March 02, 2025",
                "venue" => "DSR 401",
                "eventDate" => "March 02, 2025",
                "time" => "9:00 AM - 6:00 PM",
                "name" => "Regular text column",
                "status" => "Not Started",
            ],
        ];

        return Inertia::render('EventServices/booking-calendar', [
            'calendarEvents' => $calendarEvents,
            'listEvents' => $listEvents,
        ]);
    }
}
