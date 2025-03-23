<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{    
    protected $fillable = [
        'name',
        'specification_details',
        'date_acquired',
        'status',
        'location_id',
        'preventive_maintenance_interval_value',
        'preventive_maintenance_interval_unit',
        'last_maintained_at',
        'qr_code',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class);
    }

    public function scheduledMaintenances()
    {
        return $this->hasMany(ScheduledMaintenance::class, 'asset_id');
    }

    /**
     * If asset photos would be stored, uncomment this block.
     */
    // public function images()
    // {
    //     return $this->morphMany(Image::class, 'imageable');
    // }
}
