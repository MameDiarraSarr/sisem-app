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
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medecin_id')->constrained('medecins')->cascadeOnDelete();
            $table->foreignId('pavillon_id')->constrained('pavillons')->cascadeOnDelete();
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->enum('statut', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};
