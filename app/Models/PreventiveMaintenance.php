<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PreventiveMaintenance extends Model
{
    /** @use HasFactory<\Database\Factories\PreventiveMaintenanceFactory> */
    use HasFactory;

    protected $table = 'maintenance_schedules';

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
