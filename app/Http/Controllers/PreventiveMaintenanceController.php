<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Location;
use App\Models\WorkOrder;
use App\Models\PreventiveMaintenance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PreventiveMaintenanceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $locations = Location::all();
        $workOrders = WorkOrder::where('work_order_type', 'Preventive Maintenance')->with('asset', 'location', 'assignedTo', 'maintenanceSchedule', 'requestedBy', 'images')->get();
        $maintenanceSchedules = PreventiveMaintenance::with('asset')->get();

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
                'images' => $wo->images->pluck('url')->toArray(), // ✅ important part
                'asset' => $wo->asset ? [
                    'id' => $wo->asset->id,
                    'name' => $wo->asset->name,
                    'specification_details' => $wo->asset->specification_details,
                    'status' => $wo->asset->status,
                    'location_id' => $wo->asset->location_id,
                ] : null,
                'maintenance_schedule' => $wo->maintenanceSchedule ? [
                    'id' => $wo->maintenanceSchedule->id,
                    'asset_id' => $wo->maintenanceSchedule->asset_id,
                    'interval_unit' => $wo->maintenanceSchedule->interval_unit,
                    'interval_value' => $wo->maintenanceSchedule->interval_value,
                    'month_week' => $wo->maintenanceSchedule->month_week,
                    'month_weekday' => $wo->maintenanceSchedule->month_weekday,
                    'year_day' => $wo->maintenanceSchedule->year_day,
                    'year_month' => $wo->maintenanceSchedule->year_month,
                    'last_run_at' => $wo->maintenanceSchedule->last_run_at,
                    'is_active' => $wo->maintenanceSchedule->is_active,
                ] : null,
            ];
        });

        return Inertia::render('PreventiveMaintenance/PreventiveMaintenance', [
            'workOrders' => $formattedWorkOrders,
            'maintenanceSchedules' => $maintenanceSchedules,
            'assets' => Asset::with(['location:id,name', 'maintenanceHistories'])->get(),
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
        return Inertia::render('PreventiveMaintenance/PreventiveMaintenance');
    }

    public function destroy($id)
    {
        return Inertia::render('PreventiveMaintenance/PreventiveMaintenance');
    }
}
