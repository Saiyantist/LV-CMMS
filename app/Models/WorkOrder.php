<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    /** @use HasFactory<\Database\Factories\WorkOrderFactory> */
    use HasFactory;

    protected $fillable = [
        'report_description',
        'location',
        'status',
        'work_order_type',
        'priority',
        'date_requested',
        'date_completed',
        'remarks',
        'is_scheduled',
        'scheduled_maintenance_id',
        'scheduled_maintenance_date_scheduled',
        'requested_by',
        'assigned_to',
    ];

    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
