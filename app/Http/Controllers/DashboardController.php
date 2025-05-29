<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $workOrderRequests = WorkOrder::with('location', 'asset', 'requestedBy', 'assignedTo', 'images')
            ->where('requested_by', $user->id)->get();

        $pendingWorkOrders = WorkOrder::with('location', 'asset', 'requestedBy', 'assignedTo', 'images')
            ->where('status', 'pending')
            ->where('requested_by', $user->id)->get();

        $declinedWorkOrders = WorkOrder::with('location', 'asset', 'requestedBy', 'assignedTo', 'images')
            ->where('status', 'declined')
            ->where('requested_by', $user->id)->get();

        $formattedWorkOrders = $workOrderRequests->map(function ($wo) {
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
            ];
        });

        return Inertia::render('Dashboard', [
            'workOrderRequests' => $formattedWorkOrders ,
            'pendingWorkOrders' => $pendingWorkOrders,
            'declinedWorkOrders' => $declinedWorkOrders,
            'locations' => Location::select('id', 'name')->get(),
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'roles' => $user->roles->map(function ($role) {
                    return ['name' => $role->name];
                }),
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ],
        ]);
    }
}
