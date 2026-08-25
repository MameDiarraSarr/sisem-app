<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Jetons de réinitialisation pour les patients (identifiés par téléphone)
        Schema::create('password_reset_tokens_patients', function (Blueprint $table) {
            $table->string('telephone')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens_patients');
    }
};