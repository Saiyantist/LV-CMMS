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
        $workOrderType = fake()->randomElement(['Work Order', 'Preventive Maintenance', 'Compliance']);

        $descriptions = [
            "The airconditioning unit isn't responding to remote inputs.",
            "Lights in the hallway flicker continuously.",
            "There's a water leak under the sink in the faculty room.",
            "Ceiling fan is making an unusual humming sound.",
            "Some light switches are loose or unresponsive.",
            "Power outlets in the conference room are not functioning.",
            "The door hinge is broken and difficult to close properly.",
            "Cracks have formed along the wall near the window.",
            "The tiles on the corridor are uneven and loose.",
            "Bathroom faucet is leaking even when shut off tightly.",
            "The electric kettle used in the pantry isn't heating.",
            "Some desks in the lab are unstable or wobbly.",
            "Windows won't lock securely.",
            "Wi-Fi signal is very weak in this room.",
            "The sound system in the auditorium is producing static.",
            "Projector in this classroom doesn't turn on.",
            "Paint is peeling on several walls near the stairwell.",
            "Water dispenser isn't cooling water anymore.",
            "Fire extinguisher cabinet is missing its glass cover.",
            "Main entrance automatic doors are delayed in response.",
            "Mold spotted on ceiling tiles in the library.",
            "Air vent covers are missing or dislodged.",
            "Hand dryer in restroom isn't operating.",
            "Several fluorescent bulbs have gone dim.",
            "Sink drainage is clogged and water pools up.",
            "The filing cabinet drawers get stuck when pulled.",
            "Refrigerator in the staff kitchen is leaking water.",
            "Emergency exit sign flickers and isn't fully lit.",
            "Walls have scuff marks and scratches from equipment.",
            "Left-side whiteboard is stained and difficult to clean.",
        ];
        
        $data = [
            'report_description' => fake()->randomElement($descriptions),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),
            'status' => $status,
            'work_order_type' => $workOrderType,
            'requested_by' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'requested_at' => fake()->dateTimeBetween('-2 month', 'now')->format('Y-m-d H:i:s'),
        ];

        // If work order type is Preventive Maintenance, always assign an asset
        if ($workOrderType === 'Preventive Maintenance') {
            $data['asset_id'] = Asset::inRandomOrder()->first()?->id ?? Asset::factory();
            $data['priority'] = fake()->randomElement(['Low', 'Medium', 'High', 'Critical']);
            $data['label'] = fake()->randomElement(['HVAC','Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label']);
            $data['remarks'] = fake()->optional()->sentence();
        }
        // If work order type is Compliance, add compliance-specific data
        else if ($workOrderType === 'Compliance') {
            $data['compliance_area'] = fake()->randomElement([
                'Fire Safety Compliance',
                'Plumbing and Sanitation',
                'Structural Safety',
                'Occupational Safety and Health',
                'Accessibility Compliance'
            ]);
            $data['priority'] = fake()->randomElement(['Low', 'Medium', 'High', 'Critical']);
            $data['remarks'] = fake()->paragraph(); // Safety protocols
        }
        // For other work order types, only add priority, label, and remarks if status is not Pending
        else if ($status !== 'Pending') {
            $data['priority'] = fake()->randomElement(['Low', 'Medium', 'High', 'Critical']);
            $data['label'] = fake()->randomElement(['HVAC','Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label']);
            $data['remarks'] = fake()->optional()->sentence();
            $data['asset_id'] = fake()->boolean(85) ? Asset::inRandomOrder()->first()?->id : null; // 85% chance of having an asset
        }

        // Only add assigned_to and assigned_at if status is Assigned
        if ($status === 'Assigned' || $status === 'Scheduled' || $status === 'Ongoing' || $status === 'Completed') {
            $data['assigned_to'] = User::role('maintenance_personnel')->inRandomOrder()->first()?->id ?? User::factory();
            $data['assigned_at'] = fake()->dateTimeBetween('-1 week', '-1 day')->format('Y-m-d H:i:s');
            $data['scheduled_at'] = fake()->dateTimeBetween('+3 days', '+2 month')->format('Y-m-d H:i:s');
        }

        // Only add completed_at if status is Completed
        if ($status === 'Completed') {
            $data['completed_at'] = fake()->dateTimeBetween('+4 days', '+3 month')->format('Y-m-d H:i:s');
        }

        // Add approved_at and approved_by on a chance basis, but not for Pending Work Orders
        if (fake()->boolean(30) && !($status === 'Pending' && $workOrderType === 'Work Order')) { // 30% chance of being approved
            $data['approved_at'] = fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d H:i:s');
            $data['approved_by'] = fake()->randomElement(['Dr. Sharene', 'Bro. Noli']);
        }

        return $data;
    }
}
