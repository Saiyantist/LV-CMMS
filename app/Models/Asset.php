<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{    
    use SoftDeletes;

    protected $fillable = [
        'name',
        'specification_details',
        'date_acquired',
        'status',
        'location_id',
        'preventive_maintenance_interval_value',
        'preventive_maintenance_interval_unit',
        'last_maintained_at',
        // 'qr_code',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class);
    }

    public function maintenanceHistories()
    {
        return $this->hasMany(AssetMaintenanceHistory::class);
    }

    public function maintenanceSchedule()
    {
        return $this->hasOne(PreventiveMaintenance::class, 'asset_id', 'id');
    }

    /**
     * If asset photos would be stored, uncomment this block.
     */
    // public function images()
    // {
    //     return $this->morphMany(Image::class, 'imageable');
    // }
}
