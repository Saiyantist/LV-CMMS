<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\Location;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkOrder>
 */
class WorkOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'report_description' => fake()->sentence(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),
            'status' => fake()->randomElement(['Pending', 'Assigned', 'Ongoing', 'Overdue', 'Completed', 'For Budget Request', 'Cancelled', 'Declined']),
            'work_order_type' => fake()->randomElement(['Work Order', 'Preventive Maintenance', 'Compliance']),
            'label' => fake()->randomElement(['Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label']),
            'priority' => fake()->randomElement(['Low', 'Medium', 'High', 'Critical']),
            'requested_at' => fake()->dateTimeBetween('-2 month', 'now'),
            'completed_at' => fake()->optional(0.3)->dateTimeBetween('now', '+1 month'),
            'remarks' => fake()->optional()->sentence(),
            'asset_id' => fake()->boolean(80) ? Asset::inRandomOrder()->first()?->id : null, // 50% chance of having an asset
            'requested_by' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'assigned_to' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
