<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    protected function user()
    {
        return auth()->user();
    }

    public function index()
    {
        $user = Auth::user();

        $locations = Location::all();

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
                'images' => $wo->images->pluck('url')->toArray(),
                'asset' => $wo->asset ? [
                    'id' => $wo->asset->id,
                    'name' => $wo->asset->name,
                    'specification_details' => $wo->asset->specification_details,
                    'status' => $wo->asset->status,
                    'location_id' => $wo->asset->location_id,
                ] : null,
            ];
        });

        // Get upcoming work orders (excluding preventive maintenance)
        $upcomingWorkOrders = WorkOrder::with('location', 'asset', 'requestedBy', 'assignedTo')
            ->where('scheduled_at', '>=', Carbon::now())
            ->where('work_order_type', '!=', 'Preventive Maintenance')
            ->where('work_order_type', '!=', 'Compliance')
            ->where('status', '!=', 'completed')
            ->orderBy('scheduled_at', 'asc')
            ->limit(3)
            ->get()
            ->map(function ($wo) {
                return [
                    'id' => $wo->id,
                    'report_description' => $wo->report_description,
                    'status' => $wo->status,
                    'work_order_type' => $wo->work_order_type,
                    'priority' => $wo->priority ?: "",
                    'scheduled_at' => Carbon::parse($wo->scheduled_at)->format('m/d/Y'),
                    'requested_at' => Carbon::parse($wo->requested_at)->format('m/d/Y'),
                    'requested_by' => [
                        'id' => $wo->requestedBy->id,
                        'name' => $wo->requestedBy->first_name . ' ' . $wo->requestedBy->last_name,
                    ],
                    'location' => [
                        'id' => $wo->location_id,
                        'name' => $wo->location ? $wo->location->name : null,
                    ],
                    'asset' => $wo->asset,
                    'assigned_to' => $wo->assignedTo ? [
                        'id' => $wo->assignedTo->id,
                        'name' => $wo->assignedTo->first_name . ' ' . $wo->assignedTo->last_name,
                    ] : null,
                    'label' => $wo->label,
                    'approved_at' => $wo->approved_at ? Carbon::parse($wo->approved_at)->format('m/d/Y') : "",
                    'approved_by' => $wo->approved_by ?: "",
                    'remarks' => $wo->remarks ?: "",
                    'images' => $wo->images->pluck('url')->toArray(),
                ];
            });

        // Get upcoming preventive maintenance
        $upcomingPreventiveMaintenance = WorkOrder::with('location', 'asset', 'requestedBy', 'assignedTo')
            ->where('work_order_type', 'Preventive Maintenance')
            ->where('scheduled_at', '>=', Carbon::now())
            ->where('status', '!=', 'completed')
            ->orderBy('scheduled_at', 'asc')
            ->limit(3)
            ->get()
            ->map(function ($wo) {
                return [
                    'id' => $wo->id,
                    'report_description' => $wo->report_description,
                    'status' => $wo->status,
                    'work_order_type' => $wo->work_order_type,
                    'priority' => $wo->priority ?: "",
                    'scheduled_at' => Carbon::parse($wo->scheduled_at)->format('m/d/Y'),
                    'requested_at' => Carbon::parse($wo->requested_at)->format('m/d/Y'),
                    'requested_by' => [
                        'id' => $wo->requestedBy->id,
                        'name' => $wo->requestedBy->first_name . ' ' . $wo->requestedBy->last_name,
                    ],
                    'location' => [
                        'id' => $wo->location_id,
                        'name' => $wo->location ? $wo->location->name : null,
                    ],
                    'asset' => $wo->asset,
                    'assigned_to' => $wo->assignedTo ? [
                        'id' => $wo->assignedTo->id,
                        'name' => $wo->assignedTo->first_name . ' ' . $wo->assignedTo->last_name,
                    ] : null,
                    'label' => $wo->label,
                    'approved_at' => $wo->approved_at ? Carbon::parse($wo->approved_at)->format('m/d/Y') : "",
                    'approved_by' => $wo->approved_by ?: "",
                    'remarks' => $wo->remarks ?: "",
                    'images' => $wo->images->pluck('url')->toArray(),
                ];
            });
        
        // Get upcoming compliances
        $upcomingCompliances = WorkOrder::with(['location', 'assignedTo', 'requestedBy'])
        ->where('work_order_type', 'Compliance')
        ->whereIn('status', ['Assigned', 'Ongoing', 'For Budget Request'])
        ->orderBy('scheduled_at', 'asc')
        ->take(3)
        ->get()
        ->map(function ($wo) {
            return [
                'id' => $wo->id,
                'compliance_area' => $wo->compliance_area,
                'report_description' => $wo->report_description,
                'status' => $wo->status,
                'work_order_type' => $wo->work_order_type,
                'priority' => $wo->priority ?: "",
                'scheduled_at' => $wo->scheduled_at,
                'requested_at' => $wo->requested_at,
                'requested_by' => [
                    'id' => $wo->requestedBy->id,
                    'name' => $wo->requestedBy->first_name . ' ' . $wo->requestedBy->last_name,
                ],
                'location' => [
                    'id' => $wo->location_id,
                    'name' => $wo->location ? $wo->location->name : null,
                ],
                'assigned_to' => $wo->assignedTo ? [
                    'id' => $wo->assignedTo->id,
                    'first_name' => $wo->assignedTo->first_name,
                    'last_name' => $wo->assignedTo->last_name,
                ] : null,
                'label' => $wo->label,
                'approved_at' => $wo->approved_at ? Carbon::parse($wo->approved_at)->format('m/d/Y') : "",
                'approved_by' => $wo->approved_by ?: "",
                'remarks' => $wo->remarks ?: "",
                'images' => $wo->images->pluck('url')->toArray(),
            ];
        });

        return Inertia::render('Dashboard', [
            'workOrderRequests' => $formattedWorkOrders,
            'pendingWorkOrders' => $pendingWorkOrders,
            'declinedWorkOrders' => $declinedWorkOrders,
            'upcomingWorkOrders' => $upcomingWorkOrders,
            'upcomingPreventiveMaintenance' => $upcomingPreventiveMaintenance,
            'upcomingCompliances' => $upcomingCompliances,
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'roles' => $user->roles->map(function ($role) {
                    return ['name' => $role->name];
                }),
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ],
            'locations' => $locations,
        ]);
    }
}
