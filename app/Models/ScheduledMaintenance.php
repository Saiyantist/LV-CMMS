<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduledMaintenance extends Model
{
    protected $fillable = [
        'details',
        'scheduled_at',
        'maintained_at',
        'work_order_id',
        'asset_id',
    ];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
