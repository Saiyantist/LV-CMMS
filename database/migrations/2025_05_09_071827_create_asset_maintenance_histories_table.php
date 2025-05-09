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
        Schema::create('asset_maintenance_histories', function (Blueprint $table) {
            $table->id();
            $table->text('downtime_reason');
            $table->enum('status', ['Failed', 'Under Maintenance', 'Operational'])->default('Failed');
            $table->dateTime('maintained_at');
            $table->dateTime('failed_at')->nullable();
    
            $table->foreignId('work_order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('asset_id')->constrained()->cascadeOnDelete();
    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_maintenance_histories');
    }
};
