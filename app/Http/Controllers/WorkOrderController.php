<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkOrderRequest;
use App\Mail\CancelledWorkOrder;
use App\Mail\NewWorkOrder;
use App\Mail\UpdatedWorkOrder;
use App\Mail\AssignedWorkOrder;
use App\Models\Asset;
// use App\Models\Image;
use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Queue\Worker;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WorkOrderController extends Controller
{
    protected $gasdCoordinator;

    public function __construct()
    {
        $this->gasdCoordinator = User::find(2); // For testing, this is gelo's student lv email acting as GASD Coordinator
    }

    // --------------- Resource Controller Methods ---------------

    /**
     * Display a listing of the resource.
     * It is also used to pass the needed props to the modals for the create forrm and edit form.
     */
    public function index()
    {
        $user = auth()->user();

        $workOrders = WorkOrder::with(['location', 'asset', 'requestedBy', 'assignedTo', 'attachments']);

        if ($user->hasPermissionTo('view own work orders') && !$user->hasPermissionTo('manage work orders')) {
            $workOrders->where('requested_by', $user->id);
        }

        /**
         * Format work orders to include attachments
         */
        $formattedWorkOrders = $workOrders->get()->map(function ($wo) {
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
                'requested_at' => \Carbon\Carbon::parse($wo->requested_at)->format('m/d/Y H:i'),
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
                'attachments' => $wo->attachments->pluck('url')->toArray(), // ✅ important part
                'asset' => $wo->asset ? [
                    'id' => $wo->asset->id,
                    'name' => $wo->asset->name,
                    'specification_details' => $wo->asset->specification_details,
                    'status' => $wo->asset->status,
                    'location_id' => $wo->asset->location_id,
                ] : null,
            ];
        });


        return Inertia::render('WorkOrders/Index',
        [
            'workOrders' => $formattedWorkOrders,
            'locations' => Location::select('id', 'name')->get(),
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
            'assigned_to' => $isWorkOrderManager ? $request->assigned_to : null,
            'assigned_at' => $isWorkOrderManager ? now() : null,
            'scheduled_at' => $isWorkOrderManager ? $request->scheduled_at : null,
            'asset_id' => $isWorkOrderManager ? $request->asset_id : null,
            'remarks' => $isWorkOrderManager ? $request->remarks : null,
        ]);

        // Handle image uploads (if any)
        if ($request->hasFile('attachments')) {
            $this->handleImageUploads($request->file('attachments'), $workOrder->id);
        }

        // Only send email if the creator is not a work order manager
        if (!$isWorkOrderManager) {
            // Mail the GASD Coordinator
            $workOrder->load(['location', 'requestedBy']);
            $workOrderData = [
                'id' => $workOrder->id,
                'requested_at' => $workOrder->requested_at,
                'report_description' => $workOrder->report_description,
                'location' => $workOrder->location->name,
                'requested_by' => $workOrder->requestedBy->first_name . ' ' . $workOrder->requestedBy->last_name,
            ];
            Mail::to($this->gasdCoordinator->email)->send(new NewWorkOrder($workOrderData));
        }

        $oldAssignedTo = $workOrder->assigned_to;
        $oldStatus = $workOrder->status;
        // Send email to assigned maintenance personnel if assignment changed
        if ($request->status === 'Assigned' && ($oldAssignedTo !== $request->assigned_to || $oldStatus !== 'Assigned')) {
            $workOrder->load(['location', 'requestedBy', 'assignedTo']);
            $workOrderData = [
                'id' => $workOrder->id,
                'requested_by' => $workOrder->requestedBy->first_name . ' ' . $workOrder->requestedBy->last_name,
                'requested_at' => \Carbon\Carbon::parse($workOrder->requested_at)->format('m/d/Y H:i'),
                'scheduled_at' => \Carbon\Carbon::parse($workOrder->scheduled_at)->format('m/d/Y'),
                'location' => $workOrder->location->name,
                'report_description' => $workOrder->report_description,
                'priority' => $workOrder->priority,
                'remarks' => $workOrder->remarks,
            ];
            Mail::to($workOrder->assignedTo->email)->send(new AssignedWorkOrder($workOrderData));
        }
        
        return redirect()->route('work-orders.index')->with('success', 'Work order created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkOrder $workOrder)
    {
        $user = auth()->user();

        $workOrder->load(['location', 'asset', 'requestedBy', 'assignedTo', 'attachments']);

        $formattedWorkOrder = [
            'id' => $workOrder->id,
            'report_description' => $workOrder->report_description,
            'status' => $workOrder->status,
            'work_order_type' => $workOrder->work_order_type,
            'label' => $workOrder->label,
            'priority' => $workOrder->priority ?: "",
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
            'attachments' => $workOrder->attachments->pluck('url')->toArray(),
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

        // Handle image uploads
        if ($request->hasFile('attachments')) {
            $this->handleImageUploads($request->file('attachments'), $workOrder->id);
        }
        
        // Handle image deletions
        if ($request->has('deleted_attachments')) {
            $this->handleDeleteImage($request->deleted_attachments, $workOrder->id);
        }

        /** Maintenance Personnel */
        if ($user->hasRole('maintenance_personnel')) {
            
            // Cater requests to change the status
            if (count($request->all()) === 1 && array_key_exists('status', $request->all())) {
                
                $validTransitions = [
                    'Assigned' => ['Ongoing', 'Completed'],
                    'Ongoing' => ['Assigned', 'Completed'],
                ];
                
                // Updating via the dropdown
                if (isset($validTransitions[$workOrder->status]) && in_array($request->status, $validTransitions[$workOrder->status])) {
                    
                    if($request->status === "Completed") {
                        $workOrder->update([
                            'status' => $request->status,
                            'completed_at' => now(),
                        ]);
                    }
                    else {
                        $workOrder->update(['status' => $request->status]);
                    }

                    // Send email to requester if status is Ongoing or Completed
                    if (in_array($request->status, ['Ongoing', 'Completed'])) {
                        $workOrder->load(['location', 'requestedBy', 'assignedTo']);
                        $workOrderData = [
                            'id' => $workOrder->id,
                            'status' => $workOrder->status,
                            'location' => $workOrder->location->name,
                            'report_description' => $workOrder->report_description,
                            'assigned_to' => $workOrder->assignedTo->first_name . ' ' . $workOrder->assignedTo->last_name,
                            'completed_at' => $workOrder->completed_at ? \Carbon\Carbon::parse($workOrder->completed_at)->format('m/d/Y H:i') : null,
                        ];
                        Mail::to($workOrder->requestedBy->email)->send(new UpdatedWorkOrder($workOrderData));
                    }

                    return redirect()->route('work-orders.assigned-tasks')->with(['success' => 'Work Order updated successfully']);
                }

                // Cancelling own pending work orders
                else if ($request->status === "Cancelled") {
                    $workOrder->update(['status' => $request->status]);

                    // Mail the GASD Coordinator for Cancellation
                    $workOrder->load(['location', 'requestedBy']);
                    $workOrderData = [
                        'id' => $workOrder->id,
                        'user_id' => $user->id,
                        'requested_by' => $workOrder->requestedBy->first_name . ' ' . $workOrder->requestedBy->last_name,
                        'location' => $workOrder->location->name,
                        'report_description' => $workOrder->report_description,
                    ];
                    Mail::to($this->gasdCoordinator->email)->send(new CancelledWorkOrder($workOrderData));

                    return redirect()->route('work-orders.index')->with(['success' => 'Work Order cancelled successfully']);
                }
                else {
                    return redirect()->route('work-orders.assigned-tasks')->with(['error' => 'Something went wrong while updating status :/']);
                }
            }
            
            // Request is from "My Work Orders" page
            else {
                $workOrder->update([
                    'location_id' => $request->location_id,
                    'report_description' => $request->report_description,
                ]);
                return redirect()->route('work-orders.index')->with(['success' => 'Work Order updated successfully']);
            }
            return redirect()->route('work-orders.assigned-tasks')->with(['error' => 'Cannot update.']);
        }

        /** Department Head */
        else if ($user->hasRole('department_head')) {
            if (count($request->all()) === 1 && array_key_exists('status', $request->all()) && $request->status === "Cancelled") {
                $workOrder->update(['status' => $request->status]);

                // Mail the GASD Coordinator for Cancellation
                $workOrder->load(['location', 'requestedBy']);
                $workOrderData = [
                    'id' => $workOrder->id,
                    'user_id' => $user->id,
                    'requested_by' => $workOrder->requestedBy->first_name . ' ' . $workOrder->requestedBy->last_name,
                    'location' => $workOrder->location->name,
                    'report_description' => $workOrder->report_description,
                ];
                Mail::to($this->gasdCoordinator->email)->send(new CancelledWorkOrder($workOrderData));

                return redirect()->route('work-orders.index')->with('success', 'Work Order cancelled successfully.');
            }
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
                return redirect()->route('work-orders.index')->with('success', 'Work Order updated successfully.');
            }
            return redirect()->route('work-orders.index')->with('error', 'Something went wrong while updating.');
        }
        
        /** Work Order Manager */
        else if ($user->hasPermissionTo('manage work orders')) {

            // Updating via the dropdown
            if (count($request->all()) === 1 && array_key_exists('status', $request->all())) {
                if($request->status === "Completed") {
                    $workOrder->update([
                        'status' => $request->status,
                        'completed_at' => now(),
                    ]);
                }
                else if ($request->status === "For Budget Request") {
                    $workOrder->update([
                        'status' => $request->status,
                        'scheduled_at' => null,
                    ]);
                }
                else {
                    $workOrder->update(['status' => $request->status]);
                }

                // Send email to requester for specific status changes
                if (in_array($request->status, ['Assigned', 'For Budget Request', 'Declined', 'Ongoing', 'Completed'])) {
                    $workOrder->load(['location', 'requestedBy', 'assignedTo']);
                    $workOrderData = [
                        'id' => $workOrder->id,
                        'status' => $workOrder->status,
                        'location' => $workOrder->location->name,
                        'report_description' => $workOrder->report_description,
                    ];

                    // Add additional data for specific statuses
                    if (in_array($request->status, ['Assigned', 'Ongoing', 'Completed'])) {
                        $workOrderData['assigned_to'] = $workOrder->assignedTo->first_name . ' ' . $workOrder->assignedTo->last_name;
                        if ($request->status === 'Completed') {
                            $workOrderData['completed_at'] = \Carbon\Carbon::parse($workOrder->completed_at)->format('m/d/Y H:i');
                        }
                    }

                    Mail::to($workOrder->requestedBy->email)->send(new UpdatedWorkOrder($workOrderData));
                }

                return redirect()->route('work-orders.index')->with('success', 'Work Order status updated successfully.');
            }

            if ($request->routeIs('work-orders.update')) {
                $oldAssignedTo = $workOrder->assigned_to;
                $oldStatus = $workOrder->status;

                $workOrder->update([
                    'location_id' => $request->location_id,
                    'report_description' => $request->report_description,
                    'label' => $request->label,
                    'scheduled_at' => $request->scheduled_at,
                    'priority' => $request->priority,
                    'assigned_to' => $request->assigned_to,
                    'status' => $request->status,
                    'approved_at' => $request->approved_at,
                    'approved_by' => $request->approved_by,
                    'asset_id' => $request->asset_id,
                    'remarks' => $request->remarks,
                ]);

                // Send email to requester if status is one of the specified ones
                if (in_array($request->status, ['Assigned', 'For Budget Request', 'Declined', 'Ongoing', 'Completed'])) {
                    $workOrder->load(['location', 'requestedBy', 'assignedTo']);
                    $workOrderData = [
                        'id' => $workOrder->id,
                        'status' => $workOrder->status,
                        'location' => $workOrder->location->name,
                        'report_description' => $workOrder->report_description,
                    ];

                    // Add additional data for specific statuses
                    if (in_array($request->status, ['Assigned', 'Ongoing', 'Completed'])) {
                        $workOrderData['assigned_to'] = $workOrder->assignedTo->first_name . ' ' . $workOrder->assignedTo->last_name;
                        if ($request->status === 'Completed') {
                            $workOrderData['completed_at'] = \Carbon\Carbon::parse($workOrder->completed_at)->format('m/d/Y H:i');
                        }
                    }

                    Mail::to($workOrder->requestedBy->email)->send(new UpdatedWorkOrder($workOrderData));
                }

                // Send email to assigned maintenance personnel if assignment changed
                if ($request->status === 'Assigned' && ($oldAssignedTo !== $request->assigned_to || $oldStatus !== 'Assigned')) {
                    $workOrder->load(['location', 'requestedBy', 'assignedTo']);
                    $workOrderData = [
                        'id' => $workOrder->id,
                        'requested_by' => $workOrder->requestedBy->first_name . ' ' . $workOrder->requestedBy->last_name,
                        'requested_at' => \Carbon\Carbon::parse($workOrder->requested_at)->format('m/d/Y H:i'),
                        'scheduled_at' => \Carbon\Carbon::parse($workOrder->scheduled_at)->format('m/d/Y'),
                        'location' => $workOrder->location->name,
                        'report_description' => $workOrder->report_description,
                        'priority' => $workOrder->priority,
                        'remarks' => $workOrder->remarks,
                    ];
                    Mail::to($workOrder->assignedTo->email)->send(new AssignedWorkOrder($workOrderData));
                }

                return redirect()->route('work-orders.index')->with('success', 'Work Order updated successfully.');
            }

            else {
                $oldAssignedTo = $workOrder->assigned_to;
                $oldStatus = $workOrder->status;

                $workOrder->update([
                    'label' => $request->label,
                    'scheduled_at' => $request->scheduled_at,
                    'priority' => $request->priority,
                    'assigned_to' => $request->assigned_to,
                    'status' => $request->status,
                    'approved_at' => $request->approved_at,
                    'approved_by' => $request->approved_by,
                ]);

                // Send email to requester if status is one of the specified ones
                if (in_array($request->status, ['Assigned', 'For Budget Request', 'Declined', 'Ongoing', 'Completed'])) {
                    $workOrder->load(['location', 'requestedBy', 'assignedTo']);
                    $workOrderData = [
                        'id' => $workOrder->id,
                        'status' => $workOrder->status,
                        'location' => $workOrder->location->name,
                        'report_description' => $workOrder->report_description,
                    ];

                    // Add additional data for specific statuses
                    if (in_array($request->status, ['Assigned', 'Ongoing', 'Completed'])) {
                        $workOrderData['assigned_to'] = $workOrder->assignedTo->first_name . ' ' . $workOrder->assignedTo->last_name;
                        if ($request->status === 'Completed') {
                            $workOrderData['completed_at'] = \Carbon\Carbon::parse($workOrder->completed_at)->format('m/d/Y H:i');
                        }
                    }

                    Mail::to($workOrder->requestedBy->email)->send(new UpdatedWorkOrder($workOrderData));
                }

                // Send email to assigned maintenance personnel if assignment changed
                if ($request->status === 'Assigned' && ($oldAssignedTo !== $request->assigned_to || $oldStatus !== 'Assigned')) {
                    $workOrder->load(['location', 'requestedBy', 'assignedTo']);
                    $workOrderData = [
                        'id' => $workOrder->id,
                        'requested_by' => $workOrder->requestedBy->first_name . ' ' . $workOrder->requestedBy->last_name,
                        'requested_at' => \Carbon\Carbon::parse($workOrder->requested_at)->format('m/d/Y H:i'),
                        'scheduled_at' => \Carbon\Carbon::parse($workOrder->scheduled_at)->format('m/d/Y'),
                        'location' => $workOrder->location->name,
                        'report_description' => $workOrder->report_description,
                        'priority' => $workOrder->priority,
                        'remarks' => $workOrder->remarks,
                    ];
                    Mail::to($workOrder->assignedTo->email)->send(new AssignedWorkOrder($workOrderData));
                }
            }

            return redirect()->route('work-orders.index')->with('success', 'Work Order updated successfully.');
        }

        else {
            return redirect()->route('work-orders.index')->with('error', 'Something went wrong while updating.');
        }
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkOrder $workOrder)
    {
        
        $user = auth()->user();
        
        if (!$user->hasPermissionTo('manage work orders')) {
            return redirect()->route('work-orders.index')->with('error', 'You do not have permission to delete work orders.');
        }
        
        if ($workOrder-> status !== "Cancelled" &&  $workOrder->status !== "Declined") {
            return redirect()->route('work-orders.index')->with('error', 'Only "Cancelled" and "Declined" work orders can be deleted.');
        }
        
        $workOrder->update(['status' => 'Deleted']);
        $workOrder->delete();
        
        return redirect()->route('work-orders.index')->with('success', 'Work order deleted successfully.');
    }

    // --------------- Custom Methods ---------------

    private function handleImageUploads($files, $workOrderId)
    {
        foreach ($files as $file) {
            $filename = 'wo_' . $workOrderId . '_' . uniqid() . '.' . $file->extension();
            $path = $file->storeAs('work_orders', $filename, 'public'); // Save under storage/app/public/work_orders folder
            
            Attachment::create([
                'attachable_id' => $workOrderId,
                'attachable_type' => WorkOrder::class,
                'path' => $path,
                'file_type' => $file->getClientMimeType(),
            ]);
        }
    }

    private function handleDeleteImage($deleteFiles, $workOrderId)
    {
        foreach ($deleteFiles as $file) {
            $removeFromUrl = config('app.url') . 'storage/'; // Remove app URL and 'storage/' prefix
            $filePath = str_replace($removeFromUrl, '', $file);
            $deleteFile = Attachment::where('path', $filePath)
                ->where('attachable_id', $workOrderId)
                ->where('attachable_type', WorkOrder::class)
                ->first();
                
            if ($deleteFile) {
                $deleteFile->delete(); // Delete the attachment record
                \Storage::disk('public')->delete($filePath); // Delete the file from storage
            }
        }
    }

    public function assignedWorkOrders()
    {
        $user = auth()->user();

        $workOrders = WorkOrder::with(['location', 'asset', 'requestedBy', 'assignedTo', 'attachments'])
            ->where('assigned_to', $user->id)
            ->get()
            ->map(function ($wo) {
                return [
                    'id' => $wo->id,
                    'report_description' => $wo->report_description,
                    'status' => $wo->status,
                    'work_order_type' => $wo->work_order_type,
                    'label' => $wo->label,
                    'priority' => $wo->priority ?: "",
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
                    'attachments' => $wo->attachments->pluck('url')->toArray(), // ✅ important part
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

    /**
     *  Storing preventive maintenance work orders:
     *      - This method handles specific logic for preventive maintenance work orders
     */
    public function storePreventiveMaintenanceWorkOrder(Request $request)
    {
        $user = auth()->user();

        $isWorkOrderManager = $user->hasPermissionTo('manage work orders');

        // Validate the request data
        $validated = $request->validate([
            'report_description' => 'required|string|max:1000',
            'location_id' => 'required|exists:locations,id',
            'attachments.*' => 'nullable|image|max:5120', // If any images are being uploaded
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
