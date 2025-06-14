<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ComplianceAndSafetyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $workOrders = WorkOrder::where('work_order_type', 'Compliance')
            ->with(['location', 'assignedTo', 'attachments'])
            ->get();

        $locations = Location::all();
        $maintenancePersonnel = User::role('maintenance_personnel')->get();

        return Inertia::render('ComplianceAndSafety/ComplianceAndSafety', [
            'workOrders' => $workOrders,
            'locations' => $locations,
            'maintenancePersonnel' => $maintenancePersonnel
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'compliance_area' => 'required|string',
            'location_id' => 'required|exists:locations,id',
            'report_description' => 'required|string',
            'remarks' => 'nullable|string',
            'scheduled_at' => 'required|date',
            'priority' => 'required|string',
            'assigned_to' => 'required|exists:users,id',
            'attachments.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120' // 5MB max
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $workOrder = WorkOrder::create([
            'work_order_type' => 'Compliance',
            'compliance_area' => $request->compliance_area,
            'location_id' => $request->location_id,
            'report_description' => $request->report_description,
            'remarks' => $request->remarks,
            'scheduled_at' => $request->scheduled_at,
            'priority' => $request->priority,
            'assigned_to' => $request->assigned_to,
            'status' => 'Assigned',
            'requested_by' => auth()->user()->id,
            'requested_at' => now()
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                
                Attachment::create([
                    'path' => $path,
                    'file_type' => $file->getClientOriginalExtension(),
                    'attachable_id' => $workOrder->id,
                    'attachable_type' => WorkOrder::class
                ]);
            }
        }

        return redirect()->route('work-orders.compliance-and-safety')->with('success', 'Compliance work order created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'compliance_area' => 'required|string',
            'location_id' => 'required|exists:locations,id',
            'report_description' => 'required|string',
            'remarks' => 'nullable|string',
            'scheduled_at' => 'required|date',
            'priority' => 'required|string',
            'assigned_to' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $workOrder = WorkOrder::findOrFail($id);
        
        $workOrder->update([
            'compliance_area' => $request->compliance_area,
            'location_id' => $request->location_id,
            'report_description' => $request->report_description,
            'remarks' => $request->remarks,
            'scheduled_at' => $request->scheduled_at,
            'priority' => $request->priority,
            'assigned_to' => $request->assigned_to,
        ]);

        return redirect()->route('work-orders.compliance-and-safety')->with('success', 'Compliance work order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $workOrder = WorkOrder::findOrFail($id);
            // Delete any associated attachments
            if ($workOrder->attachments) {
                foreach ($workOrder->attachments as $attachment) {
                    // Delete the file from storage
                    if (Storage::exists($attachment->path)) {
                        Storage::delete($attachment->path);
                    }
                    // Delete the attachment record
                    $attachment->delete();
                }
            }
    
            // Delete the work order
            $workOrder->update(['status' => 'Deleted']);
            $workOrder->delete();
    
            return redirect()->back()->with('success', 'Compliance and safety work order has been deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete compliance and safety work order.' . $e->getMessage());
        }

    }
}
