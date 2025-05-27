<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetMaintenanceHistory;
use App\Models\WorkOrder;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AssetMaintenanceHistorySeeder extends Seeder
{
    public function run(): void
    {
        $assets = Asset::all();

        foreach ($assets as $asset) {
            if ($asset->status === 'End of Useful Life') continue;

            $historyCount = rand(1, 3);
            $timelineStart = Carbon::parse($asset->date_acquired);
            $lastMaintainedAt = $timelineStart->copy();

            for ($i = 0; $i < $historyCount; $i++) {
                $lastHistory = $asset->maintenanceHistories()->latest()->first();

                // If asset is dead, break
                if ($asset->status === 'End of Useful Life') break;

                // If previous history is unresolved, don't create new — update instead
                if ($lastHistory && in_array($lastHistory->status, ['Under Maintenance'])) {
                    // Decide the resolution
                    $resolution = fake()->boolean(98.5) ? 'Resolved' : 'End of Useful Life';
                    $failedAt = $lastHistory->failed_at ?? now()->subWeeks(1);

                    if ($resolution === 'Resolved') {
                        $maintainedWindowStart = Carbon::parse($failedAt)->addDay();
                        $maintainedWindowEnd = now();
                        if ($maintainedWindowStart->lessThan($maintainedWindowEnd)) {
                            $maintainedAt = fake()->dateTimeBetween($maintainedWindowStart, $maintainedWindowEnd);
                            $lastHistory->update([
                                'status' => 'Resolved',
                                'maintained_at' => $maintainedAt,
                            ]);
                            $asset->update(['status' => 'Functional']);
                            $lastMaintainedAt = Carbon::instance($maintainedAt)->copy()->addDay();
                        } else {
                            // Not realistic → skip
                            break;
                        }
                    } else {
                        $lastHistory->update([
                            'status' => 'End of Useful Life',
                            'maintained_at' => now(),
                        ]);
                        $asset->update(['status' => 'End of Useful Life']);
                        break;
                    }

                    continue;
                }

                // Else: generate a new history
                $status = fake()->boolean(0.5) ? 'End of Useful Life' : fake()->randomElement(['Under Maintenance', 'Resolved']);
                $failedAt = $this->safeDateBetween($lastMaintainedAt, now());
                $failedAtCarbon = Carbon::instance($failedAt);
                $maintainedAt = null;

                if ($status === 'Under Maintenance') {
                    $asset->update(['status' => 'Under Maintenance']);
                } elseif ($status === 'Resolved') {
                    $maintainedWindowStart = $failedAtCarbon->copy()->addDay();
                    $maintainedWindowEnd = now();
                    if ($maintainedWindowStart->lessThan($maintainedWindowEnd)) {
                        $maintainedAt = $this->safeDateBetween($maintainedWindowStart, $maintainedWindowEnd);
                        $asset->update(['status' => 'Functional']);
                        $lastMaintainedAt = Carbon::instance($maintainedAt)->copy()->addDay();
                    } else {
                        break;
                    }
                } elseif ($status === 'End of Useful Life') {
                    $asset->update(['status' => 'End of Useful Life']);
                }

                $workOrder = WorkOrder::where('asset_id', $asset->id)->inRandomOrder()->first();

                AssetMaintenanceHistory::create([
                    'asset_id' => $asset->id,
                    'work_order_id' => $workOrder?->id,
                    'downtime_reason' => fake()->sentence(),
                    'status' => $status,
                    'failed_at' => $failedAtCarbon,
                    'maintained_at' => $maintainedAt,
                ]);

                if ($status === 'End of Useful Life') break;
            }
        }
    }

    protected function safeDateBetween(\DateTimeInterface $start, \DateTimeInterface $end)
    {
        if ($start >= $end) {
            // If the range is invalid, just return the start to prevent crash
            return $start;
        }

        return fake()->dateTimeBetween($start, $end);
    }
}