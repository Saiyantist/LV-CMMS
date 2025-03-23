<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkOrderRequest;
use App\Models\Image;
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

        if ($user->hasAnyRole(['internal_requester', 'department_head'])) {
            $workOrders = WorkOrder::where('requested_by', $user->id)
                ->with(['location', 'asset', 'assignedTo'])
                ->get();
        } elseif ($user->hasAnyRole(['gasd_coordinator', 'super_admin'])) {
            $workOrders = WorkOrder::with(['location', 'asset', 'requestedBy', 'assignedTo'])->get();
        } else {
            abort(403, 'Unauthorized');
        }
        return Inertia::render('WorkOrders/Index', [
            'workOrders' => $workOrders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkOrderRequest $request)
    {
        $user = Auth::user();

        // Create the work order with auto-filled fields
        $workOrder = WorkOrder::create([
            'report_description' => $request->report_description,
            'location_id' => $request->location_id,
            'requested_at' => now(),
            'requested_by' => $user->id,
            'status' => 'Pending', // Default status
            'work_order_type' => 'Work Order', // Default type
            'label' => 'No Label', // Default label (can be changed later)
            'priority' => null,
        ]);

        // Handle image uploads (if any)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('work_orders', 'public'); // Store in storage/app/public/work_orders
                Image::create([
                    'imageable_id' => $workOrder->id,
                    'imageable_type' => WorkOrder::class,
                    'file_path' => $path,
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
