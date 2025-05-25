<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWorkOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasAnyRole([
            'maintenance_personnel',
            'internal_requester',
            'gasd_coordinator',
            'super_admin'
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = auth()->user();
        $requestData = $this->all();

        // Validation from dropDown updates
        if (count($requestData) === 1 && array_key_exists('status', $requestData)) {
            return $rules = [ 'status' => ['required', Rule::in(['Pending', 'Assigned', 'Scheduled', 'Ongoing', 'Overdue', 'Completed', 'For Budget Request', 'Cancelled', 'Declined'])]];
        } 
        
        if ($this->routeIs('work-orders.update')) {

            if ($user->hasPermissionTo('manage work orders')) {

                if($this->status === "For Budget Request"){
                    return $rules = [
                        'label' => ['required', Rule::in(['HVAC','Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label'])],
                        'priority' => ['nullable', Rule::in(['Low', 'Medium', 'High', 'Critical'])], // Maybe AI-generated in the future
                        'status' => ['required', Rule::in(['Pending', 'Assigned', 'Scheduled', 'Ongoing', 'Overdue', 'Completed', 'For Budget Request', 'Cancelled', 'Declined'])],
                    ];
                }
                else {
                    return $rules = [
                        'label' => ['required', Rule::in(['HVAC','Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label'])],
                        'scheduled_at' => 'required|date',
                        'priority' => ['nullable', Rule::in(['Low', 'Medium', 'High', 'Critical'])], // Maybe AI-generated in the future
                        'assigned_to' => 'required',
                        'status' => ['required', Rule::in(['Pending', 'Assigned', 'Scheduled', 'Ongoing', 'Overdue', 'Completed', 'For Budget Request', 'Cancelled', 'Declined'])],
                        'asset_id' => 'nullable',
                        'approved_at' => 'nullable|date',
                        'approved_by' => 'nullable|string|max:255',
                    ];
                }
            }

            if ($user->hasPermissionTo('edit own work orders')) {
                return $rules = [
                    'location_id' => 'required|exists:locations,id',
                    'report_description' => 'required|string|max:1000',
                    'images' => 'nullable|array', // Accept multiple images
                    'images.*' => 'image|mimes:jpg,jpeg,png,JPG,JPEG,PNG|max:1024',
                ];
            }
        }
        
        else {
            // Default Work Order Request Validation
            $rules = [
                'location_id' => 'required|exists:locations,id',
                'report_description' => 'required|string|max:1000',
                'images' => 'nullable|array', // Accept multiple images
                'images.*' => 'image|mimes:jpg,jpeg,png,JPG,JPEG,PNG|max:1024',
            ];

            // Work Order Manager Validation add-ons
            if ($user->hasPermissionTo('manage work orders')) {
                $rules = array_merge($rules, [
                    'work_order_type' => ['required', Rule::in(['Work Order', 'Preventive Maintenance', 'Compliance'])],
                    'label' => ['required', Rule::in(['HVAC','Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label'])],
                    'priority' => ['nullable', Rule::in(['Low', 'Medium', 'High', 'Critical'])], // Maybe AI-generated in the future
                    'scheduled_at' => 'required|date',
                    'status' => ['required', Rule::in(['Pending', 'Assigned', 'Scheduled', 'Ongoing', 'Overdue', 'Completed', 'For Budget Request', 'Cancelled', 'Declined'])],
                    'assigned_to' => 'required',
                    'asset_id' => 'nullable',
                    'remarks' => 'nullable|string|max:1000',
                ]);
            } 
            
            return $rules;
        } 

        // if work order type is PMS or Compliance
        // report description is not required.

    }
}
