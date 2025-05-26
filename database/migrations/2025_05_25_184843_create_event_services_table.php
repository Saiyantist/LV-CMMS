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
$table->string('name'); // or event_name
$table->string('venue'); // or location
$table->date('event_date');
$table->string('status')->default('pending');
$table->string('time')->nullable();
$table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_services');
    }
}