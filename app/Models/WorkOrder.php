<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkOrder extends Model
{
    /** @use HasFactory<\Database\Factories\WorkOrderFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'work_order_type',
        'compliance_area',
        'location_id',
        'report_description',
        'remarks',
        'scheduled_at',
        'priority',
        'assigned_to',
        'status',
        'label',
        'requested_by',
        'requested_at',
        'assigned_at',
        'approved_at',
        'approved_by',
        'completed_at',
        'asset_id',
        'maintenance_schedule_id',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function maintenanceHistories()  
    {
        return $this->hasManyThrough(
            AssetMaintenanceHistory::class,
            Asset::class,
            'id',         // Local key on Asset: Primary key on Asset used to join with AssetMaintenanceHistory
            'asset_id',   // Foreign key on AssetMaintenanceHistory: References the Asset model
            'asset_id',   // Foreign key on WorkOrder: References the Asset model
            'id'          // Local key on Asset: Primary key on Asset used to join with WorkOrder
        );
    }

    public function maintenanceSchedule()
    {
        return $this->belongsTo(PreventiveMaintenance::class, 'maintenance_schedule_id');
    }

    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
    
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // public function images()
    // {
    //     return $this->morphMany(Image::class, 'imageable');
    // }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
