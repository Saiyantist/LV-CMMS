<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventServicesTable extends Migration
{
    public function up()
    {
        Schema::create('event_services', function (Blueprint $table) {
            $table->id();
$table->unsignedBigInteger('user_id');
$table->string('name');
$table->json('venue')->nullable(); // Multiple or nullable
$table->string('department')->nullable();
$table->string('description')->nullable(); // Event purpose
$table->string('participants')->nullable();
$table->integer('number_of_participants')->nullable();
$table->date('event_start_date');
$table->date('event_end_date');
$table->time('event_start_time');
$table->time('event_end_time');
$table->json('requested_services')->nullable(); // Multiple or nullable
$table->string('proof_of_approval')->nullable(); // File path
$table->string('status')->default('Pending');
$table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_services');
    }
}