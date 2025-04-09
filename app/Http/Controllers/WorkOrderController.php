<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkOrderRequest;
use App\Models\Image;
use App\Models\Location;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $workOrders = WorkOrder::with(['location', 'asset', 'requestedBy', 'assignedTo']);

        if ($user->hasPermissionTo('view own work orders') && !$user->hasPermissionTo('manage work orders')) {
            $workOrders->where('requested_by', $user->id);
        }
        return Inertia::render('WorkOrders/Index',
        [
            'workOrders' => $workOrders->get(),
            'locations' => Location::select('id', 'name')->get(),
            'user' => [
                // ...$user->toArray(), // converts the user model to array including roles. downside is everything is sent to FE.
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();


        return Inertia::render('WorkOrders/Create', [
            'locations' => Location::select('id', 'name')->get(),
            'user' => [
                // ...$user->toArray(), // converts the user model to array including roles. downside is everything is sent to FE.
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkOrder $workOrder)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('manage work orders') && $workOrder->requested_by != $user->id) {
            return back()->with('error', 'You are not allowed to edit this work order.');
        }

        return Inertia::render('WorkOrders/Edit', [
            'workOrder' => $workOrder,
            'locations' => Location::select('id', 'name')->get(),
            'user' => [
                // ...$user->toArray(), // converts the user model to array including roles. downside is everything is sent to FE.
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreWorkOrderRequest $request, WorkOrder $workOrder)
    {
        $user = auth()->user();
        
        if (!$user->hasPermissionTo('manage work orders') && $workOrder->requested_by != $user->id) {
            return back()->with('error', 'You are not allowed to update this work order.');
        }

        if ($workOrder !== 'Pending' && !$user->hasPermissionTo('manage work orders')) {
            return back()->with('error', 'Only pending work orders can be updated by requesters.');
        }

        $workOrder->update([
            'report_description' => $request->report_description,
            'location_id' => $request->location_id,
            'status' => $request->status,
            'work_order_type' => $request->work_order_type,
            'label' => $request->label,
            'priority' => $request->priority,
            'remarks' => $request->remarks,
        ]);

        return redirect()->route('work-orders.index')->with('success', 'Work Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkOrder $workOrder)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('manage work orders')) {
            // dd(('You do not have permission to DELETE'));
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
