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
        Schema::create('examen_demandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bulletin_examen_id')->constrained('bulletin_examens')->cascadeOnDelete();
            $table->foreignId('examen_id')->constrained('examens')->restrictOnDelete();
            $table->timestamps();

            $table->unique(['bulletin_examen_id', 'examen_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examen_demandes');
    }
};
