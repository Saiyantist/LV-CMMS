<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
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
        $workOrders = WorkOrder::whereNotNull('maintenance_schedule_id')->with('maintenanceSchedule')->get();

        return Inertia::render('AssetManagement/AssetManagement', [
            'assets' => $assets,
            'locations' => Location::all(),
            'maintenancePersonnel' => User::role('maintenance_personnel')->with('roles')->get(),
            'preventiveMaintenanceWorkOrders' => $workOrders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validatedAssetData = $request->validate([
            'name' => 'required|string|max:255',
            'specification_details' => 'required|string',
            'location_id' => 'required|exists:locations,id',
            'status' => 'required|string',
            'date_acquired' => 'required|date',
        ]);
        
        $validatedPreventiveMaintenance = $request->validate([
            'has_preventive_maintenance' => 'nullable|boolean',
            'description' => 'required_if:has_preventive_maintenance,1',
            'assigned_to' => 'required_if:has_preventive_maintenance,1',
            'schedule' => 'required_if:has_preventive_maintenance,1|in:Weekly,Monthly,Yearly',
            'weeklyFrequency' => 'required_if:schedule,Weekly',
            'monthlyFrequency' => 'required_if:schedule,Monthly',
            'monthlyDay' => 'required_if:schedule,Monthly',
            'yearlyMonth' => 'required_if:schedule,Yearly',
            'yearlyDay' => 'required_if:schedule,Yearly',
        ]);

        $validatedPreventiveMaintenance['schedule'] === "Weekly" 
            ? $validatedPreventiveMaintenance['schedule'] = "weeks"
            : $validatedPreventiveMaintenance['schedule'];
        
        /** 
         * Preventive Maintenance 
         *  - store the preventive maintenance data if there is a preventive maintenance set for the asset being created.
         *  - else, create the asset normally..
        */
        if ($request->has('has_preventive_maintenance')) {

            // 1. Create the asset first
            $asset = Asset::create($validatedAssetData);
            
            $unit = strtolower($validatedPreventiveMaintenance['schedule']); // 'Weeks' -> 'weeks'
            
            // 2. Create the preventive maintenanceschedule data
            // these are just initials
            $scheduleData = [
                'asset_id' => $asset->id,
                'interval_unit' => $unit,
                'is_active' => true,
                'last_run_at' => null,
            ];
            
            /**
             * Based on the schedule type chosen "Weeks", "Monthly", "Yearly", store only the data that is needed.
             * 
             *      e.g. weeks 
             *          and a weeklyFrequency of 2
             *      => store the interval_value of "weeks" and the weeklyFrequency of "2", others are null.
             *      => means EVERY 2 WEEKS system should create a work order for this asset.
             * 
             * 
             *      e.g. monthly
             *          and a monthlyFrequency of 2,
             *          and a montlyDay of "Sunday"
             *      => store the interval_value of "months" and the monthlyFrequency of "2", and the month_weekday of "sunday", others are null.
             *      => means every 2nd Sunday of the month system should create a work order for this asset.
             */
            switch ($unit) {
                case 'weeks':
                    $scheduleData['interval_value'] = $request->weeklyFrequency;
                    break;
                    
                case 'monthly':
                    $scheduleData['month_week'] = $request->monthlyFrequency;
                    $scheduleData['month_weekday'] = strtolower($request->monthlyDay);
                    break;
                    
                case 'yearly':
                    $scheduleData['year_month'] = strtolower($request->yearlyMonth);
                    $scheduleData['year_day'] = $request->yearlyDay;
                    break;
                }
                        
            $maintenanceSchedule = $asset->maintenanceSchedule()->create($scheduleData);

            $now = now();

            WorkOrder::create([
                'asset_id' => $validatedAssetData['id'],
                'location_id' => $validatedAssetData['location_id'],
                'work_order_type' => 'Preventive Maintenance',
                'report_description' => $validatedPreventiveMaintenance['description'] ?? 'Auto-generated PM from schedule',
                'status' => 'Pending',
                'requested_by' => 1, // or set to system admin
                'requested_at' => $now,
                'scheduled_at' => $now,
                'maintenance_schedule_id' => $maintenanceSchedule->id,
            ]);

            return redirect()->back()->with('success', 'Asset created successfully.');
        }

        else {
            // Create a new asset normally using the validate data
            Asset::create($validatedAssetData);
            return redirect()->back()->with('success', 'Asset created successfully.');
        }
        return redirect()->back()->with('error', 'Something went wrong while creating asset :/');
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
