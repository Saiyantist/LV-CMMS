<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AssetMaintenanceHistory extends Model
{
    use HasFactory;

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
