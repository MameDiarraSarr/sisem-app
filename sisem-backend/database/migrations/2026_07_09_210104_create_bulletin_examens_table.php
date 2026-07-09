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
        Schema::create('bulletin_examens', function (Blueprint $table) {
            $table->id();
            $table->string('numero_labo');
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('pavillon_id')->nullable()->constrained('pavillons')->nullOnDelete();
            $table->foreignId('medecin_id')->nullable()->constrained('medecins')->nullOnDelete();
            $table->text('indication_examen');
            $table->string('traitement_en_cours')->nullable();
            $table->date('date_enregistrement');
            $table->enum('statut', ['enregistre', 'saisi', 'valide'])->default('enregistre');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulletin_examens');
    }
};
