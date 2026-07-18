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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('mot_de_passe_temporaire')->default(true);
        });
        Schema::table('patients', function (Blueprint $table) {
            $table->boolean('mot_de_passe_temporaire')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('mot_de_passe_temporaire');
        });
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn('mot_de_passe_temporaire');
        });
    }
};
