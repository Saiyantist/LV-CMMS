<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        // Optionally filter locations based on a query parameter
        $query = $request->input('query', '');
        $locations = Location::where('name', 'like', '%' . $query . '%')->get();

        return response()->json($locations);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:locations,name',
        ]);
    
        $location = Location::create([
            'name' => $validated['name'],
            'added_by' => $user->id,
        ]);
    
        return response()->json(['id' => $location->id]);
    }
}
