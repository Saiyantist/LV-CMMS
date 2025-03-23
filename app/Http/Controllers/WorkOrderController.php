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
        return Inertia::render('WorkOrders/Index', ['workOrders' => $workOrders->get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        return Inertia::render('WorkOrders/Create', [
            'locations' => Location::select('id', 'name')->get(),
            'auth' => [
                'user' => [
                'id' => $user->id,
                'name' => $user->name,
                ],
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

        $isWOManager = $user->hasPermissionTo('manage work orders');

        $workOrder = WorkOrder::create([
            'report_description' => $request->report_description,
            'location_id' => $request->location_id,
            'requested_at' => now(),
            'requested_by' => $user->id,
            'status' => $isWOManager ? $request->status ?? 'Pending' : 'Pending',
            'work_order_type' => $isWOManager ? $request->work_order_type ?? 'Work Order' : 'Work Order',
            'label' => $isWOManager ? $request->label ?? 'No Label' : 'No Label',
            'priority' => $isWOManager ? $request->priority : null,
            'remarks' => $isWOManager ? $request->remarks : null,
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WorkOrder $workOrder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkOrder $workOrder)
    {
        //
    }
}
