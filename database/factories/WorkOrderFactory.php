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
        $status = fake()->randomElement(['Pending', 'Assigned', 'Scheduled', 'Ongoing', 'Overdue', 'Completed', 'For Budget Request', 'Cancelled', 'Declined']);
        
        $data = [
            'report_description' => fake()->sentence(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),
            'status' => $status,
            'work_order_type' => fake()->randomElement(['Work Order', 'Preventive Maintenance', 'Compliance']),
            'requested_by' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'requested_at' => fake()->dateTimeBetween('-2 month', 'now')->format('Y-m-d H:i:s'),
            'asset_id' => fake()->boolean(80) ? Asset::inRandomOrder()->first()?->id : null, // 80% chance of having an asset
        ];  //asset shall only have if !pending

        // Only add priority, label, and remarks if status is not Pending
        if ($status !== 'Pending') {
            $data['priority'] = fake()->randomElement(['Low', 'Medium', 'High', 'Critical']);
            $data['label'] = fake()->randomElement(['HVAC','Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label']);
            $data['remarks'] = fake()->optional()->sentence();
        }

        // Only add assigned_to and assigned_at if status is Assigned
        if ($status === 'Assigned' || $status === 'Scheduled' || $status === 'Ongoing' || $status === 'Completed') {
            $data['assigned_to'] = User::inRandomOrder()->first()?->id ?? User::factory();
            $data['assigned_at'] = fake()->dateTimeBetween('-1 week', '-1 day')->format('Y-m-d H:i:s');
        }
        
        // Only add scheduled_at if status is Scheduled
        if ($status === 'Scheduled') {
            $data['scheduled_at'] = fake()->dateTimeBetween('+3 days', '+2 month')->format('Y-m-d H:i:s');
        }

        // Only add completed_at if status is Completed
        if ($status === 'Completed') {
            $data['completed_at'] = fake()->dateTimeBetween('+4 days', '+3 month')->format('Y-m-d H:i:s');
        }

        // Add approved_at and approved_by on a chance basis
        if (fake()->boolean(30)) { // 30% chance of being approved
            $data['approved_at'] = fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s');
            $data['approved_by'] = fake()->randomElement(['Dr. Sharene', 'Bro. Noli']);
        }

        return $data;
    }
}
