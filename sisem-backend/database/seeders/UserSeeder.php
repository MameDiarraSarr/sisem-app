<?php

namespace Database\Seeders;

use App\Models\Affectation;
use App\Models\Medecin;
use App\Models\Pavillon;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $pavillonM = Pavillon::where('nom', 'Pavillon M')->first();
        $usad = Pavillon::where('nom', 'USAD')->first();

        User::create([
            'matricule' => 'ADM-001', 'prenom' => 'Awa', 'nom' => 'Diop',
            'email' => 'admin@albertroyer.sn', 'password' => 'test123',
            'telephone' => '770000001', 'role' => 'admin',
        ]);

        User::create([
            'matricule' => 'SEC-001', 'prenom' => 'Marième', 'nom' => 'Fall',
            'email' => 'secretaire@albertroyer.sn', 'password' => 'test123',
            'telephone' => '770000002', 'role' => 'secretaire',
        ]);

        User::create([
            'matricule' => 'TEC-001', 'prenom' => 'Ousmane', 'nom' => 'Sow',
            'email' => 'technicien@albertroyer.sn', 'password' => 'test123',
            'telephone' => '770000003', 'role' => 'technicien',
        ]);

        User::create([
            'matricule' => 'BIO-001', 'prenom' => 'Fatou', 'nom' => 'Diallo',
            'email' => 'biologiste@albertroyer.sn', 'password' => 'test123',
            'telephone' => '770000004', 'role' => 'biologiste',
        ]);

        User::create([
            'matricule' => 'MAJ-001', 'prenom' => 'Awa', 'nom' => 'Sène',
            'email' => 'major@albertroyer.sn', 'password' => 'test123',
            'telephone' => '770000005', 'role' => 'major',
            'pavillon_id' => $pavillonM->id,
        ]);

        // Deux médecins homonymes — le cas des « deux Dr Ndiaye »
        $userAliou = User::create([
            'matricule' => 'MED-001', 'prenom' => 'Aliou', 'nom' => 'Ndiaye',
            'email' => 'aliou.ndiaye@albertroyer.sn', 'password' => 'test123',
            'telephone' => '770000006', 'role' => 'medecin',
        ]);

        $userMariama = User::create([
            'matricule' => 'MED-002', 'prenom' => 'Mariama', 'nom' => 'Ndiaye',
            'email' => 'mariama.ndiaye@albertroyer.sn', 'password' => 'test123',
            'telephone' => '770000007', 'role' => 'medecin',
        ]);

        $medAliou = Medecin::create(['user_id' => $userAliou->id, 'specialite' => 'Pédiatrie']);
        $medMariama = Medecin::create(['user_id' => $userMariama->id, 'specialite' => 'Néphrologie']);

        Affectation::create([
            'medecin_id' => $medAliou->id, 'pavillon_id' => $pavillonM->id,
            'date_debut' => now(), 'statut' => 'active',
        ]);

        Affectation::create([
            'medecin_id' => $medMariama->id, 'pavillon_id' => $usad->id,
            'date_debut' => now(), 'statut' => 'active',
        ]);
    }
}