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
        // Initial setup of table pa lang.

        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->string('report_description');
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['Pending', 'Assigned', 'Ongoing', 'Overdue', 'Completed', 'Cancelled'])->default('Pending');
            $table->enum('work_order_type', ['Work Order', 'Preventive Maintenance', 'Compliance'])->default('Work Order');
            $table->enum('label', ['Electrical', 'Plumbing', 'Painting', 'Carpentry', '', 'No Label'])->default('No Label'); /** If  work_order_typpe is "Work Order", must have label, otherwise, "No Label" */
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->nullable(); /** This can be improved by automation, kkeywords: AI, Analysis, Rule Setting (pre-defined words) */
            $table->date('requested_at');
            $table->date('completed_at')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('asset_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
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
