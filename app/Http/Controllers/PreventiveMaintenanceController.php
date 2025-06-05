<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Location;
use App\Models\WorkOrder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PreventiveMaintenanceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $locations = Location::all();
        $workOrders = WorkOrder::where('work_order_type', 'Preventive Maintenance')
            ->with(['asset.maintenanceSchedule', 'location', 'assignedTo', 'requestedBy', 'images'])
            ->get();
        $maintenanceSchedules = Asset::whereHas('maintenanceSchedule')->with('location','maintenanceSchedule')->get();
        $formattedWorkOrders = $workOrders->map(function ($wo) {
            return [
                'id' => $wo->id,
                'report_description' => $wo->report_description,
                'status' => $wo->status,
                'work_order_type' => $wo->work_order_type,
                'label' => $wo->label,
                'priority' => $wo->priority ?: "",
                'remarks' => $wo->remarks,
                'requested_by' => [
                    'id' => $wo->requestedBy->id,
                    'name' => $wo->requestedBy->first_name . ' ' . $wo->requestedBy->last_name,
                ],
                'requested_at' => \Carbon\Carbon::parse($wo->requested_at)->format('m/d/Y'),
                'assigned_to' => $wo->assignedTo ? [
                    'id' => $wo->assignedTo->id,
                    'name' => $wo->assignedTo->first_name . ' ' . $wo->assignedTo->last_name,
                ] : null,
                'assigned_at' => $wo->assigned_at ? \Carbon\Carbon::parse($wo->assigned_at)->format('m/d/Y') : null,
                'scheduled_at' => $wo->scheduled_at ? \Carbon\Carbon::parse($wo->scheduled_at)->format('m/d/Y') : null,
                'completed_at' => $wo->completed_at ? \Carbon\Carbon::parse($wo->completed_at)->format('m/d/Y') : null,
                'approved_at' => $wo->approved_at ? \Carbon\Carbon::parse($wo->approved_at)->format('m/d/Y') : null,
                'approved_by' => $wo->approved_by,
                'location' => [
                    'id' => $wo->location_id,
                    'name' => $wo->location ? $wo->location->name : null,
                ],
                'images' => $wo->images->pluck('url')->toArray(),
                'asset' => $wo->asset ? [
                    'id' => $wo->asset->id,
                    'name' => $wo->asset->name,
                    'specification_details' => $wo->asset->specification_details,
                    'status' => $wo->asset->status,
                    'location_id' => $wo->asset->location_id,
                    'last_maintained_at' => $wo->asset->last_maintained_at,
                    'maintenance_schedule' => $wo->asset->maintenanceSchedule ? [
                        'id' => $wo->asset->maintenanceSchedule->id,
                        'asset_id' => $wo->asset->maintenanceSchedule->asset_id,
                        'interval_unit' => $wo->asset->maintenanceSchedule->interval_unit,
                        'interval_value' => $wo->asset->maintenanceSchedule->interval_value,
                        'month_week' => $wo->asset->maintenanceSchedule->month_week,
                        'month_weekday' => $wo->asset->maintenanceSchedule->month_weekday,
                        'year_day' => $wo->asset->maintenanceSchedule->year_day,
                        'year_month' => $wo->asset->maintenanceSchedule->year_month,
                        'last_run_at' => $wo->asset->maintenanceSchedule->last_run_at,
                        'is_active' => $wo->asset->maintenanceSchedule->is_active,
                    ] : null,
                ] : null,
            ];
        });

        return Inertia::render('PreventiveMaintenance/PreventiveMaintenance', [
            'workOrders' => $formattedWorkOrders,
            'maintenanceSchedules' => $maintenanceSchedules,
            'assets' => Asset::with(['location', 'maintenanceHistories'])->get(),
            'maintenancePersonnel' => User::role('maintenance_personnel')->with('roles')->get(),
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'roles' => $user->roles->map(function ($role) {
                    return ['name' => $role->name];
                }),
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ],
            'locations' => $locations
        ]);
    }

    public function store(Request $request)
    {
        return Inertia::render('PreventiveMaintenance/PreventiveMaintenance');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'work_order_type' => ['required', Rule::in(['Work Order', 'Preventive Maintenance', 'Compliance'])],
            'report_description' => 'required|string|max:1000',
            'label' => ['required', Rule::in(['HVAC','Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label'])],
            'scheduled_at' => 'required|date',
            'priority' => ['nullable', Rule::in(['Low', 'Medium', 'High', 'Critical'])],
            'assigned_to' => 'required',
            'status' => ['required', Rule::in(['Pending', 'Assigned', 'Scheduled', 'Ongoing', 'Overdue', 'Completed', 'For Budget Request', 'Cancelled', 'Declined'])],
            'remarks' => 'nullable|string|max:1000',
        ]);

        try {
            WorkOrder::where('id', $id)->update($validated);
        } catch (\Exception $e) {
            return redirect()->route('work-orders.preventive-maintenance')->with('error', 'Failed to update Preventive Maintenance.');
        }
        return redirect()->route('work-orders.preventive-maintenance')->with('success', 'Preventive Maintenance updated successfully.');
    }

    public function destroy($id)
    {
        try {
            WorkOrder::where('id', $id)->update(['status' => 'Deleted']);
            WorkOrder::where('id', $id)->delete();
        } catch (\Exception $e) {
            return redirect()->route('work-orders.preventive-maintenance')->with('error', 'Failed to delete Preventive Maintenance.');
        }
        return redirect()->route('work-orders.preventive-maintenance')->with('success', 'Preventive Maintenance deleted successfully.');
    }

    public function updateSchedule(Request $request, $id)
    {
        $validated = $request->validate([
            'is_active' => 'required|in:true,false,1,0',
            'schedule' => 'required_if:has_preventive_maintenance,1|in:Weekly,Monthly,Yearly',
            'weeklyFrequency' => 'required_if:schedule,Weekly',
            'monthlyFrequency' => 'required_if:schedule,Monthly',
            'monthlyDay' => 'required_if:schedule,Monthly',
            'yearlyMonth' => 'required_if:schedule,Yearly',
            'yearlyDay' => 'required_if:schedule,Yearly',
        ]);

        $validated['schedule'] === "Weekly" 
            ? $validated['schedule'] = "weeks"
            : $validated['schedule'];

        if (isset($validated['weeklyFrequency']) && $validated['weeklyFrequency'] > 3) {
            return redirect()->back()->with('error', 'Weekly frequency cannot be greater than 3.');
        }
        
        try {
            $asset = Asset::findOrFail($id);

            // Convert schedule data to maintenance schedule format
            $scheduleData = [
                'is_active' => filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN),
                'interval_unit' => strtolower($validated['schedule']),
                'interval_value' => $validated['schedule'] === 'weeks' ? $validated['weeklyFrequency'] : 1,
                'month_week' => $validated['schedule'] === 'Monthly' ? $validated['monthlyFrequency'] : null,
                'month_weekday' => $validated['schedule'] === 'Monthly' ? $validated['monthlyDay'] : null,
                'year_month' => $validated['schedule'] === 'Yearly' ? 
                    (new \DateTime($validated['yearlyMonth'] . ' 1, 2000'))->format('n') : null,
                'year_day' => $validated['schedule'] === 'Yearly' ? $validated['yearlyDay'] : null,
            ];

            $asset->maintenanceSchedule->update($scheduleData);
        
            return redirect()->back()->with('success', 'Maintenance schedule updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update maintenance schedule: ' . $e->getMessage());
        }
    }
}
