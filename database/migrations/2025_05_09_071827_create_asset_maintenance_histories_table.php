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
            $table->enum('status', ['Failed', 'Under Maintenance', 'Resolved', 'End of Useful Life'])->nullable();
            $table->dateTime('maintained_at')->nullable();
            $table->dateTime('failed_at'); // Upon creation of an individual record, it means that the asset has already failed.
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
