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
        Schema::create('maintenance_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->onDelete('cascade');

            $table->enum('interval_unit', ['weeks', 'monthly', 'yearly']);

            /** For weekly */
            $table->unsignedTinyInteger('interval_value')->nullable();

            /** For monthly e.g. on tuesday of the 2nd week of the month */
            $table->unsignedTinyInteger('month_week')->nullable(); // 1st, 2nd, 3rd, 4th week of the month
            $table->string('month_weekday')->nullable(); // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

            /** For yearly e.g. every June 13 */
            $table->unsignedTinyInteger('year_day')->nullable(); // 1-31
            $table->unsignedTinyInteger('year_month')->nullable(); // january to december

            $table->timestamp('last_run_at')->nullable(); // Last time PM work order was generated.
            $table->boolean('is_active')->default(true); // Allow pausing schedules if needed.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedules');
    }
};
