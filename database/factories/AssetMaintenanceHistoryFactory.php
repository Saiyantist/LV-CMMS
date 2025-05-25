<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\WorkOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AssetMaintenanceHistory>
 */
class AssetMaintenanceHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $failedAt = fake()->dateTimeBetween('-30 days', '-1 day');
        $maintainedAt = fake()->dateTimeBetween($failedAt, '+7 days');

        return [
            'downtime_reason' => fake()->sentence(),
            'status' => fake()->randomElement(['Failed', 'Under Maintenance', 'Resolved', 'End of Useful Life']),
            'failed_at' => $failedAt,
            'maintained_at' => $maintainedAt,
        ];
    }
}
