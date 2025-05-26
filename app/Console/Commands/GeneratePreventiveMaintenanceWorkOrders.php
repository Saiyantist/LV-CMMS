<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\MaintenanceSchedule;
use App\Models\WorkOrder;
use Carbon\Carbon;

class GeneratePreventiveMaintenanceWorkOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'preventive-maintenance:scheduler';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate preventive maintenance work orders based on schedules';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = now();
        $schedules = MaintenanceSchedule::where('is_active', true)->get();
    
        foreach ($schedules as $schedule) {
            $asset = $schedule->asset;

            $this->info("Checking schedule ID: {$schedule->id} for asset #{$asset->id}");
            $this->info("Is the asset Functional? " . ($asset->status === 'Functional' ? 'yes' : 'no'));
            $this->info("Is due today? " . ($this->isDueToday($schedule, $now) ? 'yes' : 'no'));
            $this->info("Already run today? " . ($schedule->last_run_at?->isSameDay($now) ? 'yes' : 'no'));
            $this->info("--------------------------------");
    
            if (!$asset || $asset->status !== 'Functional') {
                continue; // Skip broken/invalid assets
            }
    
            if (!$this->isDueToday($schedule, $now)) {
                continue; // Skip if not due today
            }
    
            // Check if already generated today
            if ($schedule->last_run_at && $schedule->last_run_at->isSameDay($now)) {
                continue;
            }
    
            // Create the work order
            WorkOrder::create([
                'asset_id' => $asset->id,
                'location_id' => $asset->location_id,
                'work_order_type' => 'Preventive Maintenance',
                'report_description' => 'Scheduled Preventive Maintenance', // Might change this...
                'status' => 'Pending',
                'requested_by' => 1, // set to super admin user
                'requested_at' => $now,
                'scheduled_at' => $now,
                'maintenance_schedule_id' => $schedule->id,
            ]);
    
            // Update last run
            $schedule->update(['last_run_at' => $now]);
    
            $this->info("Created PM work order for asset #{$asset->id}");
        }
    
        return Command::SUCCESS;
        
    }

    protected function isDueToday(MaintenanceSchedule $schedule, Carbon $now): bool
    {
        switch ($schedule->interval_unit) {
            case 'weeks':
                if (!$schedule->last_run_at) return true;

                $weeksSince = $schedule->last_run_at->diffInWeeks($now);
                return $weeksSince >= $schedule->interval_value;

            case 'monthly':
                $currentWeek = ceil($now->day / 7);
                $currentDay = strtolower($now->format('l'));

                return $schedule->month_week == $currentWeek
                    && $schedule->month_weekday === $currentDay;

            case 'yearly':
                $currentDay = $now->day;
                $currentMonth = strtolower($now->format('F'));

                return $schedule->year_day == $currentDay
                    && $schedule->year_month == $currentMonth;

            default:
                return false;
        }
    }
}
