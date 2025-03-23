<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkOrder extends Model
{
    /** @use HasFactory<\Database\Factories\WorkOrderFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'report_description',
        'location_id',
        'status',
        'work_order_type',
        'label',
        'priority',
        'requested_at',
        'completed_at',
        'remarks',
        'asset_id',
        'requested_by',
        'assigned_to',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function scheduledMaintenance()
    {
        return $this->hasOne(ScheduledMaintenance::class, 'work_order_id');
    }

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
    
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
