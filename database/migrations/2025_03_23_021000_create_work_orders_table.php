<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add approved_at timestamp and approved_by string
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->text('report_description')->nullable();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['Pending', 'Assigned', 'Scheduled', 'Ongoing', 'Overdue', 'Completed', 'For Budget Request', 'Cancelled', 'Declined', 'Deleted'])->default('Pending');
            $table->enum('work_order_type', ['Work Order', 'Preventive Maintenance', 'Compliance'])->default('Work Order');
            $table->enum('label', ['HVAC','Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Repairing', 'Welding',  'No Label'])->default('No Label'); /** If  work_order_type is "Work Order", must have label, otherwise, "No Label" */
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->nullable(); /** This can be improved by automation, keywords: AI, Analysis, Rule Setting (pre-defined words) */
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('requested_at');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->string('approved_by')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('asset_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('maintenance_schedule_id')->nullable()->constrained()->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });      
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_orders');
    }
};
