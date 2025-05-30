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
        $workOrders = WorkOrder::where('work_order_type', 'Preventive Maintenance')->with('asset', 'location', 'assignedTo', 'maintenanceSchedule', 'requestedBy')->get();
        $maintenanceSchedules = PreventiveMaintenance::with('asset')->get();

        // dd($workOrders, $maintenanceSchedules);
        return Inertia::render('PreventiveMaintenance/PreventiveMaintenance', [
            'workOrders' => $workOrders,
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
