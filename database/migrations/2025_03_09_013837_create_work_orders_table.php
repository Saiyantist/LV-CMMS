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

        // Schema::create('work_orders', function (Blueprint $table) {
        //     $location =  [
        //         'DSR 201', 'DSR 215',
        //         'DSR 301', 'DSR 315',
        //         'EFS 201', 'EFS 215',
        //         'EFS 301', 'EFS 315',
        //         'EFS 401', 'EFS 410',
        //         'Auditorium', 'Auditorium Lobby',
        //         'TLE Room',
        //         'Finance',
        //         'Registrar',
        //         'College Library',
        //         'Clinic',
        //         'IC Laboratory',
        //         'Computer Laboratory A', 'Computer Laboratory B',
        //     ];

        //     $table->id();
        //     $table->string('report_description');
        //     $table->enum('location', $location);
        //     $table->enum('status', ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'])->default('Pending');
        //     $table->enum('work_order_type', ['Work Order', 'Preventive Maintenance', 'Compliance'])->default('Work Order');
            
        //     // This can be improved by automation, kkeywords: AI, Analysis, Rule Setting (pre-defined words)
        //     $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->nullable();
            
        //     $table->date('date_requested');
        //     $table->date('date_completed')->nullable();
        //     $table->text('remarks')->nullable();
            
        //     $table->boolean('is_scheduled')->nullable();

        //     // No TABLE yet for `scheduled_maintenance`
        //     $table->foreignId('scheduled_maintenance_id')->nullable()->constrained()->nullOnDelete();
        //     $table->date('scheduled_maintenance_date_scheduled')->nullable();
            
        //     $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
        //     $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            
        //     $table->timestamps();
        // });      
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_orders');
    }
};
