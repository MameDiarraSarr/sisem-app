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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->nullable()->constrained('patients')->cascadeOnDelete();
            $table->foreignId('bulletin_examen_id')->nullable()->constrained('bulletin_examens')->nullOnDelete();
            $table->string('message');
            $table->string('lien')->nullable();
            $table->boolean('lu')->default(false);
            $table->boolean('envoye')->default(false);   // passé à true quand l'envoi WhatsApp réussira
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
