<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medecins', function (Blueprint $table) {
            // Clé partagée : l'id du médecin EST l'id du personnel (héritage)
            $table->unsignedBigInteger('id')->primary();
            $table->foreign('id')->references('id')->on('personnels')->cascadeOnDelete();

            $table->string('specialite')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medecins');
    }
};