<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class MaintenanceSchedule extends Model
{
    protected $fillable = [
        'asset_id',
        'interval_unit',
        'interval_value',
        'month_week',
        'month_weekday',
        'year_day',
        'year_month',
        'last_run_at',
        'is_active',
    ];

    protected $casts = [
        'last_run_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
    
}
