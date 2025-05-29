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
        // Use the "Date Requested" (created_at) as the key in YYYY-MM-DD format
        $dateKey = $event->created_at ? date('Y-m-d', strtotime($event->created_at)) : null;
        if ($dateKey) {
            $calendarEvents[$dateKey][] = [
                'title' => $event->event_name,
                // Combine start and end time
                'time' => $event->event_start_time && $event->event_end_time
                    ? date('h:i A', strtotime($event->event_start_time)) . ' - ' . date('h:i A', strtotime($event->event_end_time))
                    : ($event->event_start_time ? date('h:i A', strtotime($event->event_start_time)) : ''),
                'status' => $event->status,
                'eventDate' => $event->event_start_date, // <-- add this
                'dateRequested' => $dateKey, // for clarity
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
// filepath: app\Http\Controllers\EventServicesController.php
public function MyBookings()
{
    $user = Auth::user();

    // Check if user is super admin or communications officer
    if ($user->hasRole('super_admin') || $user->hasRole('communications_officer')) {
        $myEvents = EventService::all();
    } else {
        $myEvents = EventService::where('user_id', $user->id)->get();
    }

$bookings = $myEvents->map(function ($event) {
    return [
        'id' => $event->id,
        'date' => $event->created_at ? $event->created_at->format('Y-m-d') : null,
        'venue' => $event->venue,
        'name' => $event->name,
        'department' => $event->department,
        'description' => $event->description,
        'participants' => $event->participants,
        'number_of_participants' => $event->number_of_participants,
        'event_start_date' => $event->event_start_date,
        'event_end_date' => $event->event_end_date,
        'event_start_time' => $event->event_start_time,
        'event_end_time' => $event->event_end_time,
        'requested_services' => $event->requested_services,
        'proof_of_approval' => $event->proof_of_approval,
        'status' => $event->status,
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
            'proof_of_approval' => 'nullable|file|mimes:jpg,png,pdf|max:10240', // 10MB
        ]);

        if ($request->hasFile('proof_of_approval')) {
            $validated['proof_of_approval'] = $request->file('proof_of_approval')->store('proofs', 'public');
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
        $validated['proof_of_approval'] = $request->file('proof_of_approval')->store('proofs', 'public');
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
    $counts = EventService::select('status')
        ->get()
        ->groupBy('status')
        ->map(fn($group) => $group->count());

    return response()->json($counts);
}

}