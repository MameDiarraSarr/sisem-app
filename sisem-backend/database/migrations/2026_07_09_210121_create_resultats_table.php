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
        Schema::create('resultats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('examen_demande_id')->constrained('examen_demandes')->cascadeOnDelete();
            $table->foreignId('analyse_reference_id')->constrained('analyse_references')->restrictOnDelete();
            $table->string('valeur_resultat');
            $table->date('date_resultat');
            $table->timestamps();

            $table->unique(['examen_demande_id', 'analyse_reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resultats');
    }
};
