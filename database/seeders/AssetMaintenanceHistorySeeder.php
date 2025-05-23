<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetMaintenanceHistory;
use App\Models\WorkOrder;
use Illuminate\Database\Seeder;

class AssetMaintenanceHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assets = Asset::all();

        foreach ($assets as $asset) {
            $count = rand(1, 5); // Each asset gets 1 to 3 maintenance records

            for ($i = 0; $i < $count; $i++) {
                // Try to find a work order that matches this asset
                $workOrder = WorkOrder::where('asset_id', $asset->id)->inRandomOrder()->first();

                AssetMaintenanceHistory::factory()->create([
                    'asset_id' => $asset->id,
                    'work_order_id' => $workOrder?->id, // nullable if no match
                ]);
            }
        }
    }
}
