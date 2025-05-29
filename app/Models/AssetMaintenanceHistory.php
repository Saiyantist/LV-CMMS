<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetMaintenanceHistory extends Model
{
    protected $fillable = [
        'downtime_reason',
        'status',
        'maintained_at',
        'failed_at',
        'work_order_id',
        'asset_id',
    ];
    
    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }
}
