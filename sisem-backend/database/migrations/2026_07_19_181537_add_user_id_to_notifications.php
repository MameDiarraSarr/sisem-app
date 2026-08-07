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
        Schema::table('notifications', function (Blueprint $table) {
            // Destinataire personnel (cloche). Le patient_id devient nullable :
            // une notification vise SOIT un patient, SOIT un membre du personnel.
            $table->foreignId('user_id')->nullable()->after('id')->constrained('personnels')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropConstrainedForeignKey('user_id');
        });
    }
};
