<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Patient : hérite d'utilisateurs via une clé primaire PARTAGÉE (patients.id = utilisateurs.id)
        Schema::create('patients', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->foreign('id')->references('id')->on('utilisateurs')->cascadeOnDelete();
            $table->string('numero_dossier')->nullable()->unique();
            $table->enum('type_patient', ['interne', 'externe']);
            $table->string('ville')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};