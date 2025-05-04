<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkOrderRequest;
use App\Models\Image;
use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkOrderController extends Controller
{
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
                'location_id' => $wo->location_id,
                'report_description' => $wo->report_description,
                'status' => $wo->status,
                'work_order_type' => $wo->work_order_type,
                'label' => $wo->label,
                'priority' => $wo->priority,
                'remarks' => $wo->remarks,
                'requested_at' => $wo->created_at->toDateString(),
                'location' => $wo->location ? ['name' => $wo->location->name] : null,
                'images' => $wo->images->pluck('url')->toArray(), // ✅ important part
            ];
        });

        return Inertia::render('WorkOrders/Index',
        [
            'workOrders' => $formattedWorkOrders,
            'locations' => Location::select('id', 'name')->get(),
            'user' => [
                // ...$user->toArray(), // converts the user model to array including roles. downside is everything is sent to FE.
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not needed, the create form and edit form is handled in the main component by passing the data needed as props.
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
        //
    }



    // In WorkOrderController.php
public function submitWorkOrder(Request $request)
{
    // Assuming the front-end sends data similar to `SubmitWorkOrder.tsx`
    $user = auth()->user();
    
    // Validate the request data
    $validated = $request->validate([
        'report_description' => 'required|string|max:1000',
        'location_id' => 'required|exists:locations,id',
        'images.*' => 'nullable|image|max:5120', // If any images are being uploaded
    ]);

    // Logic for creating a new WorkOrder
    $isWorkOrderManager = $user->hasPermissionTo('manage work orders');

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

        else {
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
            return back()->with('error', 'You do not have permission to delete this work order.');
        }

        if ($workOrder-> status !== "Cancelled") {
            return back()->with('error', 'Only CANCELLED workk orders can be deleted.');
        }

        $workOrder->update(['status' => 'Deleted']);
        $workOrder->delete();

        return redirect()->route('work-orders.index')->with('success', 'Work order deleted successfully.');
    }
}
