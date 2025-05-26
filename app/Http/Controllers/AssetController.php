<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Location;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assets = Asset::with(['location:id,name', 'maintenanceHistories'])->get();

        return Inertia::render('AssetManagement/AssetManagement', [
            'assets' => $assets,
            'locations' => Location::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Initial pa lang, there's no validation for preventive maintenance yet bc 'di pa plantsa 'yon.
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'specification_details' => 'required|string',
            'location_id' => 'required|exists:locations,id',
            'date_acquired' => 'required|date',
        ]);

        // Create a new asset using the validated data
        Asset::create($validatedData);

        // Redirect back with a success message
        return redirect()->back()->with('success', 'Asset created successfully.');
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Asset $asset)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Asset $asset)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'specification_details' => 'nullable|string',
        'location.name' => 'required|string',
        'status' => 'required|string',
        'date_acquired' => 'required|date',
        'last_maintained_at' => 'nullable|date',
    ]);

    $asset->update([
        'name' => $validated['name'],
        'specification_details' => $validated['specification_details'],
        'status' => $validated['status'],
        'date_acquired' => $validated['date_acquired'],
        'last_maintained_at' => $validated['last_maintained_at'],
    ]);

    // Optional: update related location
    if (isset($validated['location']['name'])) {
        $asset->location->update(['name' => $validated['location']['name']]);
    }

    return back()->with('success', 'Asset updated successfully.');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Asset $asset)
{
    $asset->delete();

    return redirect()->back()->with('success', 'Asset deleted successfully.');
}

}
