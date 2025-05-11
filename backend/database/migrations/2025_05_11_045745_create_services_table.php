<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('base_price', 8, 2);
            $table->integer('available_day'); // fixed spelling
            $table->integer('available_time');
            $table->unsignedBigInteger('service_categories_id');
            $table->unsignedBigInteger('type_id');
            $table->unsignedBigInteger('owner_id'); // NEW: owner (user) who created the service
            $table->json('images')->nullable(); // images as JSON
            $table->timestamps();

            // Foreign keys
            $table->foreign('service_categories_id')->references('id')->on('service_categories')->onDelete('cascade');
            $table->foreign('type_id')->references('id')->on('types')->onDelete('cascade');
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
