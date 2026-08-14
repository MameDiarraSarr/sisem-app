<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\Pavillon;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $pavillonM = Pavillon::where('nom', 'Pavillon M')->first();

        // Crée un Utilisateur (identité) + le Patient lié (même id, clé partagée)
        $creerPatient = function (array $u, array $p): Patient {
            $utilisateur = Utilisateur::create([
                'prenom' => $u['prenom'],
                'nom' => $u['nom'],
                'date_naissance' => $u['date_naissance'],
                'sexe' => $u['sexe'],
                'telephone' => $u['telephone'],
                'adresse' => $u['adresse'],
                'mot_de_passe' => $u['telephone'], // mot de passe = téléphone (provisoire)
            ]);

            return Patient::create([
                'id' => $utilisateur->id,
                'numero_dossier' => $p['numero_dossier'],
                'type_patient' => $p['type_patient'],
                'ville' => $p['ville'],
                'pavillon_id' => $p['pavillon_id'] ?? null,
            ]);
        };

        // Patient interne → rattaché directement à un pavillon
        $creerPatient(
            [
                'prenom' => 'Amadou', 'nom' => 'Diop',
                'date_naissance' => '2018-03-12', 'sexe' => 'M',
                'telephone' => '771234567', 'adresse' => 'Sicap Liberté 6',
            ],
            ['numero_dossier' => 'DOS-0001', 'type_patient' => 'interne', 'ville' => 'Dakar', 'pavillon_id' => $pavillonM->id]
        );

        // Patient externe → pas de pavillon
        $creerPatient(
            [
                'prenom' => 'Fatou', 'nom' => 'Ndiaye',
                'date_naissance' => '2021-07-04', 'sexe' => 'F',
                'telephone' => '772345678', 'adresse' => 'Grand Yoff',
            ],
            ['numero_dossier' => 'DOS-0002', 'type_patient' => 'externe', 'ville' => 'Dakar', 'pavillon_id' => null]
        );
    }
}