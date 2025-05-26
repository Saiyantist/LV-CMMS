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
        $day = date('j', strtotime($event->event_date)); // day of month (1-31)
        $calendarEvents[$day][] = [
            'title' => $event->event_name,
            'time' => date('H:i', strtotime($event->event_date)),
            'status' => $event->status,
        ];
    }

    // Map events for list view
    $listEvents = $events->map(function ($event) {
        return [
            'id' => $event->id,
            'date' => $event->created_at->format('Y-m-d'),
            'venue' => $event->location,
            'eventDate' => $event->event_date,
            'time' => date('H:i', strtotime($event->event_date)),
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
            'eventDate' => $event->event_date,
            'time' => $event->time,
            'name' => $event->name,
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

        return Inertia::render('EventServices/CreateBooking', [
            'venueNames' => $venueNames,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',           // Event Name
            'venue' => 'required|string|max:255',          // Requested Venue
            'event_date' => 'required|date',               // Event Date
            'time' => 'required',                          // Event Time
        ]);

        $event = EventService::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'venue' => $validated['venue'],
            'event_date' => $validated['event_date'],
            'time' => $validated['time'],
            'status' => 'Pending',                         // Always "Pending" when created
        ]);

        return redirect()->route('event-services.my-bookings')->with('success', 'Event booked!');
    }

public function update(Request $request, $id)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'venue' => 'required|string|max:255',
        'event_date' => 'required|date',
        'time' => 'required',
        'status' => 'required|string|max:255',
    ]);

    $event = EventService::findOrFail($id);
    $event->update([
        'name' => $validated['name'],
        'venue' => $validated['venue'],
        'event_date' => $validated['event_date'],
        'time' => $validated['time'],
        'status' => $validated['status'],
        'created_at' => now(), // Date Requested is updated to now
    ]);

    return redirect()->route('event-services.my-bookings')->with('success', 'Booking updated!');
}


public function destroy($id)
{
    $event = EventService::findOrFail($id);
    $event->delete();

    return redirect()->route('event-services.my-bookings')->with('success', 'Booking deleted!');
}

}