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
        Schema::create('departments', function (Blueprint $table) {

            // $departments = [
            //     ['name' => 'Management Information Systems'],
            //     ['name' => 'General Admin Services'],
            //     ['name' => 'Communications Office'],
            //     ['name' => 'Finance'],
            //     ['name' => 'HR'],
            //     ['name' => 'PSAS'],
            //     ['name' => 'Accountng'],
            //     ['name' => 'IT'],
            //     ['name' => 'Library'],
            //     ['name' => 'College'],
            //     ['name' => 'JHS'],
            //     ['name' => 'SHS'],
            //     ['name' => 'Elementary'],
            //     ['name' => 'Primary'],
            //     ['name' => 'No Department'],
            // ];

            $table->id();
            // $table->enum('name', $departments)->default('No Department');
            $table->string('name')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
