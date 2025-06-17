<?php
namespace App\Http\Controllers;

use App\Models\EventService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EventServicesController extends Controller
{
   public function index()
{
    $events = EventService::all();

    // Map events for calendar view
    $calendarEvents = [];
    foreach ($events as $event) {
        $start = strtotime($event->event_start_date);
        $end = strtotime($event->event_end_date);

        // Ensure logical order
        if ($end < $start) {
            [$start, $end] = [$end, $start];
        }

        for ($d = $start; $d <= $end; $d = strtotime('+1 day', $d)) {
            $dateKey = date('Y-m-d', $d);
            $calendarEvents[$dateKey][] = [
             // 'title' => $event->event_name,
                'title' => $event->name,
                'venue' => is_array($event->venue) ? implode(', ', $event->venue) : $event->venue,
                'dateRequested' => $event->created_at ? date('F j, Y', strtotime($event->created_at)) : null,
                'eventDate' => date('Y-m-d', $d),
                'eventStartDate' => $event->event_start_date,
                'eventEndDate' => $event->event_end_date,
                'time' => $event->event_start_time && $event->event_end_time
                    ? date('h:i A', strtotime($event->event_start_time)) . ' - ' . date('h:i A', strtotime($event->event_end_time))
                    : ($event->event_start_time ? date('h:i A', strtotime($event->event_start_time)) : ''),
                'status' => $event->status,
                // Add these fields:
                'department' => $event->department,
                'participants' => $event->participants,
                'number_of_participants' => $event->number_of_participants,
                'description' => $event->description,
            ];
        }
    }

    // Map events for list view
    $listEvents = $events->map(function ($event) {
        return [
            'id' => $event->id,
            'date' => $event->created_at->format('Y-m-d'),
            'venue' => $event->location,
            'eventDate' => $event->event_start_date,
            // Combine start and end time
            'time' => $event->event_start_time && $event->event_end_time
                ? date('h:i A', strtotime($event->event_start_time)) . ' - ' . date('h:i A', strtotime($event->event_end_time))
                : ($event->event_start_time ? date('h:i A', strtotime($event->event_start_time)) : ''),
            'name' => $event->event_name,
            'status' => $event->status,
        ];
    });

    return Inertia::render('EventServices/BookingCalendar', [
        'calendarEvents' => $calendarEvents,
        'listEvents' => $listEvents,
    ]);
}



protected function autoCompleteBookings()
{
    $now = now()->toDateString();
    $bookings = EventService::where('status', 'Approved')
        ->whereDate('event_end_date', '<', $now)
        ->get();

    foreach ($bookings as $booking) {
        $booking->status = 'Completed';
        $booking->save();
    }
}


// filepath: app\Http\Controllers\EventServicesController.php
public function MyBookings()
{
    $this->autoCompleteBookings(); // <-- Add this line

    $user = Auth::user();

    if (
        $user->hasRole('super_admin') ||
        $user->hasRole('communications_officer') ||
        $user->hasRole('gasd_coordinator')
    ) {
        $myEvents = EventService::with('user')->get();
    } else {
        $myEvents = EventService::with('user')->where('user_id', $user->id)->get();
    }

    $bookings = $myEvents->map(function ($event) use ($user) {
        return [
            'id' => $event->id,
            'date' => $event->created_at ? $event->created_at->format('Y-m-d') : null,
            // Always return venue as array
            'venue' => is_string($event->venue) && str_starts_with($event->venue, '[')
                ? json_decode($event->venue, true)
                : (is_array($event->venue) ? $event->venue : [$event->venue]),
            'name' => $event->name,
            'department' => $event->department,
            'description' => $event->description,
            'participants' => $event->participants,
            'number_of_participants' => $event->number_of_participants,
            'event_start_date' => $event->event_start_date,
            'event_end_date' => $event->event_end_date,
            'event_start_time' => $event->event_start_time,
            'event_end_time' => $event->event_end_time,
            'requested_services' =>
                $user->hasRole('gasd_coordinator')
                    ? $this->filterGasdServices($event->requested_services)
                    : $event->requested_services,
            'proof_of_approval' => $event->proof_of_approval,
            'proof_of_approval_original_name' => $event->proof_of_approval_original_name, // <-- add this
            'status' => $event->status,
            // Add user info for requester
            'user' => $event->user
                ? [
                    'id' => $event->user->id,
                    'first_name' => $event->user->first_name,
                    'last_name' => $event->user->last_name,
                    'name' => $event->user->name ?? null,
                    'email' => $event->user->email,
                ]
                : null,
        ];
    });

    return Inertia::render('EventServices/MyBookings', [
        'bookings' => $bookings
    ]);
}

    public function create()
    {
        // List of venue names for the form dropdown
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

        return Inertia::render('EventServices/CreateBooking',  [
            'venueNames' => $venueNames,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'venue' => 'nullable|array',
            'venue.*' => 'string|max:255',
            'department' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'participants' => 'nullable|string|max:255',
            'number_of_participants' => 'nullable|integer|min:1|max:9999',
            'event_start_date' => 'required|date',
            'event_end_date' => 'required|date|after_or_equal:event_start_date',
            'event_start_time' => 'required',
            'event_end_time' => 'required',
            'requested_services' => 'nullable|array',
            'requested_services.*' => 'string|max:255',
            'proof_of_approval' => 'nullable|file|mimes:jpg,png,pdf|max:1024', // 5MB
        ]);

        if ($request->hasFile('proof_of_approval')) {
            $file = $request->file('proof_of_approval');
            $path = $file->store('proofs', 'public');
            $validated['proof_of_approval'] = $path;
            $validated['proof_of_approval_original_name'] = $file->getClientOriginalName(); // <-- Add this
        }

        $validated['venue'] = json_encode($validated['venue'] ?? []);
        $validated['requested_services'] = json_encode($validated['requested_services'] ?? []);

        EventService::create([
            ...$validated,
            'user_id' => Auth::id(),
            'status' => 'Pending',
        ]);

        return redirect()->route('event-services.my-bookings')->with('success', 'Event booked!');
    }

public function update(Request $request, $id)
{
    $validated = $request->validate([
        'name' => 'nullable|string|max:255',
        'venue' => 'nullable|array',
        'venue.*' => 'string|max:255',
        'department' => 'nullable|string|max:255',
        'description' => 'nullable|string|max:1000',
        'participants' => 'nullable|string|max:255',
        'number_of_participants' => 'nullable|integer|min:1|max:9999',
        'event_start_date' => 'nullable|date',
        'event_end_date' => 'nullable|date|after_or_equal:event_start_date',
        'event_start_time' => 'nullable',
        'event_end_time' => 'nullable',
        'requested_services' => 'nullable|array',
        'requested_services.*' => 'string|max:255',
        'proof_of_approval' => 'nullable|file|mimes:jpg,png,pdf|max:10240',
        'status' => 'nullable|string|max:255',
    ]);

    if ($request->hasFile('proof_of_approval')) {
        $file = $request->file('proof_of_approval');
        $path = $file->store('proofs', 'public');
        $validated['proof_of_approval'] = $path;
        $validated['proof_of_approval_original_name'] = $file->getClientOriginalName(); // <-- Add this
    }

    if (isset($validated['venue'])) {
        $validated['venue'] = json_encode($validated['venue']);
    }
    if (isset($validated['requested_services'])) {
        $validated['requested_services'] = json_encode($validated['requested_services']);
    }

    $event = EventService::findOrFail($id);
    $event->update($validated);

    return redirect()->route('event-services.my-bookings')->with('success', 'Booking updated!');
}


public function destroy($id)
{
    $event = EventService::findOrFail($id);
    $event->delete();

    return redirect()->route('event-services.my-bookings')->with('success', 'Booking deleted!');
}



public function bookingsData()
{
    $bookings = EventService::all()->map(function ($event) {
        return [
            'id' => $event->id,
            'date' => $event->created_at ? $event->created_at->format('Y-m-d') : null,
            'venue' => is_string($event->venue) && str_starts_with($event->venue, '[')
                ? json_decode($event->venue, true)
                : (is_array($event->venue) ? $event->venue : [$event->venue]),
            'name' => $event->name,
            'department' => $event->department,
            'event_start_date' => $event->event_start_date,
            'event_end_date' => $event->event_end_date,
            'event_start_time' => $event->event_start_time,
            'event_end_time' => $event->event_end_time,
            'status' => $event->status,
        ];
    });

    return response()->json($bookings);
}


public function statusCounts()
{
    $allStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'];
    $counts = EventService::select('status')
        ->get()
        ->groupBy('status')
        ->map(fn($group) => $group->count());

    // Ensure all statuses are present
    $result = [];
    foreach ($allStatuses as $status) {
        $result[$status] = $counts[$status] ?? 0;
    }

    return response()->json($result);
}

public function checkConflict(Request $request)
{
    $venues = $request->venues ?? [];
    $startDate = $request->startDate;
    $endDate = $request->endDate;
    $startTime = $request->startTime;
    $endTime = $request->endTime;

    // Only consider bookings that are Pending, Approved, or On Going
    $conflicts = EventService::whereIn('status', ['Pending', 'Approved', 'On Going'])
        ->where(function ($q) use ($venues) {
            foreach ($venues as $venue) {
                $q->orWhereJsonContains('venue', $venue);
            }
        })
        ->where(function ($q) use ($startDate, $endDate) {
            $q->where(function ($q2) use ($startDate, $endDate) {
                $q2->where('event_start_date', '<=', $endDate)
                   ->where('event_end_date', '>=', $startDate);
            });
        })
        ->where(function ($q) use ($startTime, $endTime) {
            $q->where(function ($q2) use ($startTime, $endTime) {
                $q2->where('event_start_time', '<', $endTime)
                   ->where('event_end_time', '>', $startTime);
            });
        })
        ->get();

    if ($conflicts->count()) {
        return response()->json([
            'conflict' => true,
            'conflicts' => $conflicts->map(function ($c) {
                return [
                    'venue' => is_array($c->venue) ? implode(', ', $c->venue) : $c->venue,
                    'date' => $c->event_start_date . ' to ' . $c->event_end_date,
                    'time' => $c->event_start_time . ' to ' . $c->event_end_time,
                    'status' => $c->status,
                ];
            }),
        ]);
    }

    return response()->json(['conflict' => false]);
}

protected function filterGasdServices($services)
{
    $gasd = [
        "Maintainer Time",
        "Lighting",
        "Tables",
        "Bathroom Cleaning",
        "Chairs",
        "Aircon",
        "Marshal",
        "LV DRRT",
    ];

    // Decode if string
    if (is_string($services)) {
        $services = json_decode($services, true);
    }

    // If array, filter directly
    if (is_array($services)) {
        return array_values(array_filter($services, fn($s) => in_array($s, $gasd)));
    }

    // If object (assoc array), flatten and filter
    if (is_array($services)) {
        $flat = [];
        foreach ($services as $val) {
            if (is_array($val)) {
                foreach ($val as $v) {
                    if (in_array($v, $gasd)) $flat[] = $v;
                }
            } elseif (is_string($val) && in_array($val, $gasd)) {
                $flat[] = $val;
            }
        }
        return $flat;
    }

    return [];
}

public function getOccupiedTimes(Request $request)
{
    $venue = $request->venue;
    $date = $request->date;

    $bookings = EventService::whereIn('status', ['Pending', 'Approved', 'On Going'])
        ->whereJsonContains('venue', $venue)
        ->where('event_start_date', '<=', $date)
        ->where('event_end_date', '>=', $date)
        ->get(['event_start_time', 'event_end_time']);

    $occupied = $bookings->map(function ($b) {
        return [
            'start' => $b->event_start_time,
            'end' => $b->event_end_time,
        ];
    });

    return response()->json($occupied);
}


public function getTimeOptions(Request $request)
{
    // Standard time slots (30-minute intervals from 6 AM to 11:59 PM)
    $timeSlots = [];
    
    // Generate time slots from 6 AM to 11:59 PM
    $start = strtotime('06:00');
    $end = strtotime('23:59');
    $interval = 30 * 60; // 30 minutes in seconds
    
    for ($time = $start; $time <= $end; $time += $interval) {
        $timeSlots[] = date('h:i A', $time);
    }
    
    // Add 11:59 PM as final option
    if (end($timeSlots) !== '11:59 PM') {
        $timeSlots[] = '11:59 PM';
    }
    
    // If venue and date are provided, filter out occupied slots
    if ($request->has('venue') && $request->has('date')) {
        $venue = $request->venue;
        $date = $request->date;
        
        // Get bookings for this venue and date
        $bookings = \App\Models\EventService::whereIn('status', ['Pending', 'Approved', 'On Going'])
            ->whereJsonContains('venue', $venue)
            ->where('event_start_date', '<=', $date)
            ->where('event_end_date', '>=', $date)
            ->get(['event_start_time', 'event_end_time']);
        
        // Filter out occupied times
        $availableTimeSlots = array_filter($timeSlots, function($timeSlot) use ($bookings) {
            // Convert 12-hour format to 24-hour for comparison
            $time24h = date('H:i', strtotime($timeSlot));
            
            foreach ($bookings as $booking) {
                if ($time24h >= $booking->event_start_time && $time24h < $booking->event_end_time) {
                    return false; // This time is occupied
                }
            }
            
            return true; // This time is available
        });
        
        $timeSlots = array_values($availableTimeSlots);
    }
    
    return response()->json([
        'timeSlots' => $timeSlots
    ]);
}

}