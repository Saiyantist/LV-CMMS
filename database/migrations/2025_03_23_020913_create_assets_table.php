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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('specification_details');
            $table->date('date_acquired');
            $table->enum('status', ['functional', 'non-functional']);
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('preventive_maintenance_interval')->nullable(); // Refine this, interval unit (day/week/month) and interval value (number) 
            $table->date('last_maintained_at')->nullable();
            $table->string('qr_code')->unique(); // How to implement qr functionality in the system?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
