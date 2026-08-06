<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bulletin_examens', function (Blueprint $table) {
            // Date de la dernière impression/remise du résultat (null = jamais imprimé)
            $table->timestamp('imprime_le')->nullable();
            // Nombre de fois que le résultat a été imprimé
            $table->unsignedInteger('nombre_impressions')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('bulletin_examens', function (Blueprint $table) {
            $table->dropColumn(['imprime_le', 'nombre_impressions']);
        });
    }
};