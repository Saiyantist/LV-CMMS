<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AssetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assets = Asset::with(['location:id,name', 'maintenanceHistories', 'maintenanceSchedule'])->get();
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

        // Create Asset only, the store method's only responsibility dapat xD.
        if (!$request->has('has_preventive_maintenance') && !$request->has('huwag')) {
            $validatedAssetData = $request->validate([
                'name' => 'required|string|max:255',
                'specification_details' => 'required|string',
                'location_id' => 'required|exists:locations,id',
                'status' => 'required|string',
                'date_acquired' => 'required|date',
                'has_preventive_maintenance' => 'nullable|boolean',
            ]);

            // Create a new asset normally using the validate data
            Asset::create($validatedAssetData);
            return redirect()->back()->with('success', 'Asset created successfully.');
        }
        
        // If the user saved from edit modal but no input was changed.
        // This is put in place to prevent the user from saving the asset again. (Duplication)
        // Because the "Save" button there also calls the store function. THIS CAN BE OPTIMIZED LATER ON, COULD CALL A DIFFERENT METHOD.
        // else if (!$request->has('has_preventive_maintenance') && $request->has('huwag') && $request->has('name')) {
        //     return redirect()->back()->with('success', 'Nothing has been saved.');
        // }
        
        // Update PMS
        else if ($request->has('has_preventive_maintenance') && $request->has('huwag') && $request->is_active == "true" || $request->is_active == "false") {
            $validatedPreventiveMaintenance = $request->validate([
                // 'assigned_to' => 'required_if:has_preventive_maintenance,1',
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

            $validatedAssetData = $request->validate([
                'name' => 'required|string|max:255',
                'specification_details' => 'required|string',
                'location_id' => 'required|exists:locations,id',
                'status' => 'required|string',
                'date_acquired' => 'required|date',
            ]);


            $unit = strtolower($validatedPreventiveMaintenance['schedule']); // 'Weeks' -> 'weeks'
            
            $scheduleData = [
                'asset_id' => $request->id,
                'interval_unit' => $unit,
                'is_active' => true,
                'last_run_at' => null,
            ];
            
            switch ($unit) {
                case 'weeks':
                    $scheduleData['interval_value'] = $request->weeklyFrequency;
                    break;
                    
                case 'monthly':
                    $scheduleData['month_week'] = $request->monthlyFrequency;
                    $scheduleData['month_weekday'] = strtolower($request->monthlyDay);
                    break;
                    
                case 'yearly':
                    $monthMap = [
                        'january' => 1, 'february' => 2, 'march' => 3, 'april' => 4,
                        'may' => 5, 'june' => 6, 'july' => 7, 'august' => 8,
                        'september' => 9, 'october' => 10, 'november' => 11, 'december' => 12
                    ];
                    $scheduleData['year_month'] = $monthMap[strtolower($request->yearlyMonth)];
                    $scheduleData['year_day'] = $request->yearlyDay;
                    break;
                }
            
            try {
                Asset::where('id', $request->id)->first()->maintenanceSchedule()->update($scheduleData);
            } catch (\Exception $e) {
                Log::error($e);
                return redirect()->back()->with('error', 'Something went wrong while updating asset\'s PMS :/');
            }

            return redirect()->back()->with('success', 'Asset with PMS updated successfully.');
        }

        // Create PMS
        else if ($request->has('has_preventive_maintenance') && $request->has('huwag') && $request->is_active == "null") {
            $validatedPreventiveMaintenance = $request->validate([
                // 'assigned_to' => 'required_if:has_preventive_maintenance,1',
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

            $validatedAssetData = $request->validate([
                'name' => 'required|string|max:255',
                'specification_details' => 'required|string',
                'location_id' => 'required|exists:locations,id',
                'status' => 'required|string',
                'date_acquired' => 'required|date',
            ]);


            $unit = strtolower($validatedPreventiveMaintenance['schedule']); // 'Weeks' -> 'weeks'
            
            $scheduleData = [
                'asset_id' => $request->id,
                'interval_unit' => $unit,
                'is_active' => true,
                'last_run_at' => null,
            ];
            
            switch ($unit) {
                case 'weeks':
                    $scheduleData['interval_value'] = $request->weeklyFrequency;
                    break;
                    
                case 'monthly':
                    $scheduleData['month_week'] = $request->monthlyFrequency;
                    $scheduleData['month_weekday'] = strtolower($request->monthlyDay);
                    break;
                    
                case 'yearly':
                    $monthMap = [
                        'january' => 1, 'february' => 2, 'march' => 3, 'april' => 4,
                        'may' => 5, 'june' => 6, 'july' => 7, 'august' => 8,
                        'september' => 9, 'october' => 10, 'november' => 11, 'december' => 12
                    ];
                    $scheduleData['year_month'] = $monthMap[strtolower($request->yearlyMonth)];
                    $scheduleData['year_day'] = $request->yearlyDay;
                    break;
                }
            
            try {
                Asset::where('id', $request->id)->first()->maintenanceSchedule()->create($scheduleData);
            } catch (\Exception $e) {
                Log::error($e);
                return redirect()->back()->with('error', 'Something went wrong while updating asset\'s PMS :/');
            }

            return redirect()->back()->with('success', 'Asset with PMS created successfully.');
        }

        /** 
         * Preventive Maintenance 
         *  - store the preventive maintenance data if there is a preventive maintenance set for the asset being created.
         *  - else, create the asset normally..
         */
        if ($request->has('has_preventive_maintenance')) {
            $validatedPreventiveMaintenance = $request->validate([
                // 'assigned_to' => 'required_if:has_preventive_maintenance,1',
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

            $validatedAssetData = $request->validate([
                'name' => 'required|string|max:255',
                'specification_details' => 'required|string',
                'location_id' => 'required|exists:locations,id',
                'status' => 'required|string',
                'date_acquired' => 'required|date',
            ]);

            // Create the asset first
            $asset = Asset::create($validatedAssetData);

            $unit = strtolower($validatedPreventiveMaintenance['schedule']); // 'Weeks' -> 'weeks'
            
            // Create the preventive maintenanceschedule data
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
             *      e.g. "weeks", weeklyFrequency = 2
             *      => store the interval_value of "weeks" and the weeklyFrequency of "2", others are null.
             *      => means EVERY 2 WEEKS system should create a work order for this asset.
             * 
             *      e.g. "monthly", monthlyFrequency = 2, montlyDay = "Sunday"
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
                    $monthMap = [
                        'january' => 1, 'february' => 2, 'march' => 3, 'april' => 4,
                        'may' => 5, 'june' => 6, 'july' => 7, 'august' => 8,
                        'september' => 9, 'october' => 10, 'november' => 11, 'december' => 12
                    ];
                    $scheduleData['year_month'] = $monthMap[strtolower($request->yearlyMonth)];
                    $scheduleData['year_day'] = $request->yearlyDay;
                    break;
                }
                        
            $maintenanceSchedule = $asset->maintenanceSchedule()->create($scheduleData);

            $now = now();

            // Remove all of this, it shouldn't make a work order kaagad
            // WorkOrder::create([
            //     'asset_id' => $asset->id,
            //     'location_id' => $validatedAssetData['location_id'],
            //     'work_order_type' => 'Preventive Maintenance',
            //     'report_description' => $validatedPreventiveMaintenance['description'] ?? 'Auto-generated PM from schedule',
            //     'status' => 'Pending',
            //     'requested_by' => 1, // or set to system admin
            //     'requested_at' => $now,
            //     'scheduled_at' => $now, // MALI
            //     'maintenance_schedule_id' => $maintenanceSchedule->id,
            // ]);

            return redirect()->back()->with('success', 'Asset with PMS created successfully.');
        }

        else {
            return redirect()->back()->with('error', 'Something went wrong while creating asset :/');
        }
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
