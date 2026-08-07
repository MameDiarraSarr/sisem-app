<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Classe mère : attributs communs à TOUS les utilisateurs (personnel + patients)
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();
            $table->string('prenom');
            $table->string('nom');
            $table->date('date_naissance')->nullable();
            $table->enum('sexe', ['M', 'F'])->nullable();
            $table->string('telephone')->nullable()->unique();
            $table->string('email')->nullable()->unique();
            $table->string('adresse')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('mot_de_passe');
            $table->boolean('mot_de_passe_temporaire')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        // Personnel : hérite d'utilisateurs via une clé primaire PARTAGÉE (personnels.id = utilisateurs.id)
        Schema::create('personnels', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->foreign('id')->references('id')->on('utilisateurs')->cascadeOnDelete();
            $table->string('matricule')->unique();
            $table->enum('role', ['admin', 'secretaire', 'technicien', 'biologiste', 'medecin', 'major']);
            $table->enum('statut', ['actif', 'inactif'])->default('actif');
            $table->foreignId('pavillon_id')->nullable()->constrained('pavillons')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('personnels');
        Schema::dropIfExists('utilisateurs');
    }
};