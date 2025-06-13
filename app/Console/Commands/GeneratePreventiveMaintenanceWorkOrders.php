<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PreventiveMaintenance;
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
        $schedules = PreventiveMaintenance::where('is_active', true)->get();
    
        foreach ($schedules as $schedule) {
            $asset = $schedule->asset;
            $nextDueDate = $this->getNextDueDate($schedule);
            // $alreadyScheduled = WorkOrder::where('maintenance_schedule_id', $schedule->id)
            //     ->whereDate('scheduled_at', $nextDueDate->toDateString())
            //     ->exists();

            $this->info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            $this->info("Checking schedule ID: {$schedule->id} for asset #{$asset->id}");
            $this->info("Next Due Date:" . ($nextDueDate));
            // $this->info("Already Scheduled: " . ($alreadyScheduled ? 'yes, break.' : 'no'));
            $this->info("Is the asset Functional? " . ($asset->status === 'Functional' ? 'yes' : 'no, break.'));
            $this->info("Already run today? " . ($schedule->last_run_at?->isSameDay($now) ? 'yes, break.' : 'no'));
            $this->info("Is due in 3 days? " . ($nextDueDate->isAfter(now()->addDays(3)) || $nextDueDate->isBefore(now()) ? 'no, break.' : 'yes'));
            
            if (!$asset || $asset->status !== 'Functional') {
                continue; // Skip broken/invalid assets
            }
            
            if (!$nextDueDate || ($nextDueDate->isAfter(now()->addDays(3)) || $nextDueDate->isBefore(now()) ) ) {
                continue; // Skip, it's not close enough yet
            }
            
            // if ($alreadyScheduled) {
            //     // $this->info("Already scheduled");
            //     continue; // Don't create duplicates
            // }
            
            // Check if already generated today
            if ($schedule->last_run_at && $schedule->last_run_at->isSameDay($now)) {
                // $this->info("Already run today? " . ($schedule->last_run_at?->isSameDay($now) ? 'yes' : 'no'));
                continue; // Avoid duplicates
            }
            
            $this->info("--------------------------------");
            // dd("Will create work order");
            // Create the work order
            WorkOrder::create([
                'asset_id' => $asset->id,
                'location_id' => $asset->location_id,
                'work_order_type' => 'Preventive Maintenance',
                'report_description' => 'Scheduled Preventive Maintenance', // Might change this...
                'status' => 'Pending',
                'priority' => 'High',
                'requested_by' => 1, // set to super admin user
                'requested_at' => $now,
                'scheduled_at' => $nextDueDate,
                'maintenance_schedule_id' => $schedule->id,
            ]);
            
            // Update last run
            $schedule->update(['last_run_at' => $now]);
            
            $this->info("Created PM work order for asset #{$asset->id}");
            $this->info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
    
        return Command::SUCCESS;
        
    }

    protected function getNextDueDate(PreventiveMaintenance $schedule): ?Carbon
    {

        $lastRun = $schedule->last_run_at ?? $schedule->asset->date_acquired;
        $next = null;

        switch ($schedule->interval_unit) {
            case 'weeks':
                $next = Carbon::parse($lastRun)->addWeeks($schedule->interval_value);
                break;

            case 'monthly':
                $next = now()->copy()->startOfMonth();
                $week = $schedule->month_week;
                $day = ucfirst($schedule->month_weekday);
                $matches = 0;

                while ($next->month === now()->month) {
                    if ($next->englishDayOfWeek === $day) {
                        $matches++;
                        if ($matches === $week) {
                            break;
                        }
                    }
                    $next->addDay();
                }
                break;

            case 'yearly':
                $next = now()->copy()->setMonth(Carbon::parse($schedule->year_month)->month)
                            ->setDay($schedule->year_day);
                if ($next->isPast()) {
                    $next->addYear();
                }
                break;
        }

        return $next;
    }
}
