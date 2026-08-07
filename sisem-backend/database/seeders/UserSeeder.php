<?php

namespace Database\Seeders;

use App\Models\Affectation;
use App\Models\Medecin;
use App\Models\Pavillon;
use App\Models\User;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $pavillonM = Pavillon::where('nom', 'Pavillon M')->first();
        $usad = Pavillon::where('nom', 'USAD')->first();

        // Crée un Utilisateur (identité) + le Personnel lié (même id, clé partagée)
        $creerPersonnel = function (array $u, array $p): User {
            $utilisateur = Utilisateur::create([
                'prenom' => $u['prenom'],
                'nom' => $u['nom'],
                'email' => $u['email'],
                'telephone' => $u['telephone'],
                'mot_de_passe' => 'test123',
            ]);

            return User::create([
                'id' => $utilisateur->id,
                'matricule' => $p['matricule'],
                'role' => $p['role'],
                'pavillon_id' => $p['pavillon_id'] ?? null,
            ]);
        };

        $creerPersonnel(
            ['prenom' => 'Awa', 'nom' => 'Diop', 'email' => 'admin@albertroyer.sn', 'telephone' => '770000001'],
            ['matricule' => 'ADM-001', 'role' => 'admin']
        );

        $creerPersonnel(
            ['prenom' => 'Marième', 'nom' => 'Fall', 'email' => 'secretaire@albertroyer.sn', 'telephone' => '770000002'],
            ['matricule' => 'SEC-001', 'role' => 'secretaire']
        );

        $creerPersonnel(
            ['prenom' => 'Ousmane', 'nom' => 'Sow', 'email' => 'technicien@albertroyer.sn', 'telephone' => '770000003'],
            ['matricule' => 'TEC-001', 'role' => 'technicien']
        );

        $creerPersonnel(
            ['prenom' => 'Fatou', 'nom' => 'Diallo', 'email' => 'biologiste@albertroyer.sn', 'telephone' => '770000004'],
            ['matricule' => 'BIO-001', 'role' => 'biologiste']
        );

        $creerPersonnel(
            ['prenom' => 'Awa', 'nom' => 'Sène', 'email' => 'major@albertroyer.sn', 'telephone' => '770000005'],
            ['matricule' => 'MAJ-001', 'role' => 'major', 'pavillon_id' => $pavillonM->id]
        );

        // Deux médecins homonymes — le cas des « deux Dr Ndiaye »
        $userAliou = $creerPersonnel(
            ['prenom' => 'Aliou', 'nom' => 'Ndiaye', 'email' => 'aliou.ndiaye@albertroyer.sn', 'telephone' => '770000006'],
            ['matricule' => 'MED-001', 'role' => 'medecin']
        );

        $userMariama = $creerPersonnel(
            ['prenom' => 'Mariama', 'nom' => 'Ndiaye', 'email' => 'mariama.ndiaye@albertroyer.sn', 'telephone' => '770000007'],
            ['matricule' => 'MED-002', 'role' => 'medecin']
        );

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