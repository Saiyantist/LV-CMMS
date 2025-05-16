<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkOrderRequest;
use App\Models\Image;
use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WorkOrderController extends Controller
{

    // --------------- Resource Controller Methods ---------------

    /**
     * Display a listing of the resource.
     * It is also used to pass the needed props to the modals for the create forrm and edit form.
     */
    public function index()
    {
        $user = auth()->user();

        $workOrders = WorkOrder::with(['location', 'asset', 'requestedBy', 'assignedTo', 'images']);

        if ($user->hasPermissionTo('view own work orders') && !$user->hasPermissionTo('manage work orders')) {
            $workOrders->where('requested_by', $user->id);
        }

        /**
         * Format work orders to include images
         */
        $formattedWorkOrders = $workOrders->get()->map(function ($wo) {
            return [
                'id' => $wo->id,
                'report_description' => $wo->report_description,
                'status' => $wo->status,
                'work_order_type' => $wo->work_order_type,
                'label' => $wo->label,
                'priority' => $wo->priority ?: "No Priority",
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
                'assigned_at' => \Carbon\Carbon::parse($wo->assigned_at)->format('m/d/Y'),
                'scheduled_at' => \Carbon\Carbon::parse($wo->scheduled_at)->format('m/d/Y'),
                'completed_at' => \Carbon\Carbon::parse($wo->completed_at)->format('m/d/Y'),
                'location' => [
                    'id' => $wo->location_id,
                    'name' => $wo->location->name,
                ],
                'images' => $wo->images->pluck('url')->toArray(), // ✅ important part
                'asset' => $wo->asset ? [
                    'id' => $wo->asset->id,
                    'name' => $wo->asset->name,
                    'specification_details' => $wo->asset->specification_details,
                    'status' => $wo->asset->status,
                    'location_id' => $wo->asset->location_id,
                ] : null,
                'requested_by' => [
                    'id' => $wo->requestedBy->id,
                    'name' => $wo->requestedBy->first_name . ' ' . $wo->requestedBy->last_name,
                ],
                'assigned_to' => $wo->assignedTo ? [
                    'id' => $wo->assignedTo->id,
                    'name' => $wo->assignedTo->first_name . ' ' . $wo->assignedTo->last_name,
                ] : null,
            ];
        });

        return Inertia::render('WorkOrders/Index',
        [
            'workOrders' => $formattedWorkOrders,
            'locations' => Location::select('id', 'name')->get(),
            'maintenancePersonnel' => User::role('maintenance_personnel')->with('roles')->get(),
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

    /**
     * This is used for showing the Work Order Request Form for INTERNAL USERS
     * The create work order form for WORK ORDER MANAGER(S) is handled in the main component which uses the data from the index method.
     */
    public function create()
    {
        return Inertia::render('WorkOrders/SubmitRequest',
        [
            'locations' => Location::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkOrderRequest $request)
    {
        $user = auth()->user();

        $isWorkOrderManager = $user->hasPermissionTo('manage work orders');

        $workOrder = WorkOrder::create([
            'report_description' => $request->report_description,
            'location_id' => $request->location_id,
            'requested_at' => now(),
            'requested_by' => $user->id,
            'status' => $isWorkOrderManager ? $request->status ?? 'Pending' : 'Pending',
            'work_order_type' => $isWorkOrderManager ? $request->work_order_type ?? 'Work Order' : 'Work Order',
            'label' => $isWorkOrderManager ? $request->label ?? 'No Label' : 'No Label',
            'priority' => $isWorkOrderManager ? $request->priority : null,
            'remarks' => $isWorkOrderManager ? $request->remarks : null,
        ]);

        // Handle image uploads (if any)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = uniqid('wo_') . '.' . $image->extension();
                $path = $image->storeAs('work_orders', $filename, 'public');
                Image::create([
                    'imageable_id' => $workOrder->id,
                    'imageable_type' => WorkOrder::class,
                    'path' => $path,
                ]);
            }
        }
    
        return redirect()->route('work-orders.index')->with('success', 'Work order created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkOrder $workOrder)
    {
        $user = auth()->user();

        $workOrder->load(['location', 'asset', 'requestedBy', 'assignedTo', 'images']);

        $formattedWorkOrder = [
            'id' => $workOrder->id,
            'report_description' => $workOrder->report_description,
            'status' => $workOrder->status,
            'work_order_type' => $workOrder->work_order_type,
            'label' => $workOrder->label,
            'priority' => $workOrder->priority ?: "No Priority",
            'remarks' => $workOrder->remarks,
            'requested_by' => [
                'id' => $workOrder->requestedBy->id,
                'name' => $workOrder->requestedBy->first_name . ' ' . $workOrder->requestedBy->last_name,
            ],
            'requested_at' => \Carbon\Carbon::parse($workOrder->requested_at)->format('m/d/Y'),
            'assigned_to' => $workOrder->assignedTo ? [
                'id' => $workOrder->assignedTo->id,
                'name' => $workOrder->assignedTo->first_name . ' ' . $workOrder->assignedTo->last_name,
            ] : null,
            'assigned_at' => $workOrder->assigned_at ? \Carbon\Carbon::parse($workOrder->assigned_at)->format('m/d/Y') : null,
            'scheduled_at' => $workOrder->scheduled_at ? \Carbon\Carbon::parse($workOrder->scheduled_at)->format('m/d/Y') : null,
            'completed_at' => $workOrder->completed_at ? \Carbon\Carbon::parse($workOrder->completed_at)->format('m/d/Y') : null,
            'location' => [
                'id' => $workOrder->location_id,
                'name' => $workOrder->location ? $workOrder->location->name : null,
            ],
            'images' => $workOrder->images->pluck('url')->toArray(),
            'asset' => $workOrder->asset ? [
                'id' => $workOrder->asset->id,
                'name' => $workOrder->asset->name,
                'specification_details' => $workOrder->asset->specification_details,
                'status' => $workOrder->asset->status,
                'location_id' => $workOrder->asset->location_id,
            ] : null,
        ];

        return Inertia::render('WorkOrders/Show', [
            'workOrder' => $formattedWorkOrder,
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkOrder $workOrder)
    {
        // Not needed, the create form and edit form is handled in the main component by passing the data needed as props.
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreWorkOrderRequest $request, WorkOrder $workOrder)
    {
        $user = auth()->user();

        /** Maintenance Personnel */
        if ($user->hasRole('maintenance_personnel')) {

            if ($workOrder->assigned_to !== $user->id) {
                return redirect()->route('work-orders.assigned-tasks')->with(['error' => 'You are not allowed to update this work order.']);
            }

            $validTransitions = [
                'Assigned' => ['Ongoing', 'Completed'],
                'Ongoing' => ['Assigned', 'Completed'],
            ];

            if (isset($validTransitions[$workOrder->status]) && in_array($request->status, $validTransitions[$workOrder->status])) {
                $workOrder->update(['status' => $request->status]);
                return redirect()->route('work-orders.assigned-tasks')->with(['success' => 'Work Order updated successfully']);
            }

            return redirect()->route('work-orders.assigned-tasks')->with(['error' => 'Can only update "Assigned" and "Ongoing".']);
        }

        /** Internal Requester */
        if(!$user->hasPermissionTo('manage work orders')) {
            if ($workOrder->requested_by != $user->id) {
                return redirect()->route('work-orders.index')->with('error', 'You are not allowed to update this work order.');
            }
            else if ($workOrder->status !== 'Pending') {
                return redirect()->route('work-orders.index')->with('error', 'Only pending work orders can be updated by requesters.');
            }
            else {
                $workOrder->update([
                    'report_description' => $request->report_description,
                    'location_id' => $request->location_id,
                ]);
            }
        }

        /** Work Order Manager */
        
        else {
            
            // Update Status only (from status dropdown)
            if ($request->route()->getName() === 'work-orders.update'){
                $workOrder->update(['status' => $request->status,]);
                return redirect()->route('work-orders.index')->with('success', 'Work Order status updated successfully.');
            }

            // Update Work Order (expected from edit work order modal)
            $workOrder->update([
                'report_description' => $request->report_description,
                'location_id' => $request->location_id,
                'status' => $request->status,
                'work_order_type' => $request->work_order_type,
                'label' => $request->label,
                'priority' => $request->priority,
                'remarks' => $request->remarks,
            ]);
        }

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = 'wo_' . $workOrder->id . '_' . uniqid() . '.' . $image->extension(); // prefix to be added to the image name 
                $path = $image->storeAs('work_orders', $filename, 'public'); // To save under storage/app/public/work_orders folder
                Image::create([
                    'imageable_id' => $workOrder->id,
                    'imageable_type' => WorkOrder::class,
                    'path' => $path,
                ]);
            }
        }
        
        // Handle image deletions
        if ($request->has('deleted_images')) {
            foreach ($request->deleted_images as $imagePath) {
                $removeFromUrl = config('app.url') . 'storage/'; // Remove app URL and 'storage/' prefix
                $imagePath = str_replace($removeFromUrl, '', $imagePath); 
                $image = Image::where('path', $imagePath)->where('imageable_id', $workOrder->id)->first();
                if ($image) {
                    $image->delete(); // Delete the image record from the database
                    \Storage::disk('public')->delete($imagePath); // Delete the file from storage
                }
            }
        }
        return redirect()->route('work-orders.index')->with('success', 'Work Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkOrder $workOrder)
    {
        
        $user = auth()->user();
        
        if (!$user->hasPermissionTo('manage work orders')) {
            // return back()->with('error', 'You do not have permission to delete this work order.');
            return response()->json(['error' => 'You do not have permission to delete this work order.'], 403);
        }
        
        if ($workOrder-> status !== "Cancelled") {
            // return back()->with('error', 'Only CANCELLED workk orders can be deleted.');
            return response()->json(['error' => 'Only CANCELLED work orders can be deleted.'], 403);
        }
        
        $workOrder->update(['status' => 'Deleted']);
        $workOrder->delete();

        // return redirect()->route('work-orders.index')->with('success', 'Work order deleted successfully.');
        return response()->json(['success' => 'Work order deleted successfully.'], 200);
    }

    // --------------- Custom Methods ---------------

    public function assignedWorkOrders()
    {
        $user = auth()->user();

        $workOrders = WorkOrder::with(['location', 'asset', 'requestedBy', 'assignedTo', 'images'])
            ->where('assigned_to', $user->id)
            ->get()
            ->map(function ($wo) {
                return [
                    'id' => $wo->id,
                    'report_description' => $wo->report_description,
                    'status' => $wo->status,
                    'work_order_type' => $wo->work_order_type,
                    'label' => $wo->label,
                    'priority' => $wo->priority ?: "No Priority",
                    'requested_by' => [
                        'id' => $wo->requestedBy->id,
                        'name' => $wo->requestedBy->first_name . ' ' . $wo->requestedBy->last_name,
                    ],
                    'requested_at' => \Carbon\Carbon::parse($wo->requested_at)->format('m/d/Y'),
                    'assigned_to' => $wo->assignedTo ? [
                        'id' => $wo->assignedTo->id,
                        'name' => $wo->assignedTo->first_name . ' ' . $wo->assignedTo->last_name,
                    ] : null,
                    'assigned_at' => \Carbon\Carbon::parse($wo->assigned_at)->format('m/d/Y'),
                    'scheduled_at' => \Carbon\Carbon::parse($wo->scheduled_at)->format('m/d/Y'),
                    'completed_at' => \Carbon\Carbon::parse($wo->completed_at)->format('m/d/Y'),
                    'remarks' => $wo->remarks,
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
            
        return Inertia::render('WorkOrders/AssignedWorkOrders',
        [
            'workOrders' => $workOrders,
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

    public function updateWorkOrderStatus(WorkOrder $workOrder, Request $request)
    {
        // Hmm
    }
    
    /**
     *  Storing preventive maintenance work orders:
     *      - This method handles specific logic for preventive maintenance work orders
     */
    public function storePreventiveMaintenanceWorkOrder(Request $request)
    {
        $user = auth()->user();

        // Validate the request data
        $validated = $request->validate([
            'report_description' => 'required|string|max:1000',
            'location_id' => 'required|exists:locations,id',
            'images.*' => 'nullable|image|max:5120', // If any images are being uploaded
        ]);

        $workOrder = WorkOrder::create([
            'report_description' => $request->report_description,
            'location_id' => $request->location_id,
            'requested_at' => now(),
            'requested_by' => $user->id,
            'status' => $isWorkOrderManager ? ($request->status ?? 'Pending') : 'Pending',
            'work_order_type' => $isWorkOrderManager ? ($request->work_order_type ?? 'Work Order') : 'Work Order',
            'label' => $isWorkOrderManager ? ($request->label ?? 'No Label') : 'No Label',
            'priority' => $isWorkOrderManager ? $request->priority : null,
            'remarks' => $isWorkOrderManager ? $request->remarks : null,
        ]);



        return redirect()->route('work-orders.index')->with('success', 'Preventive maintenance work order created successfully.');
    }
}
