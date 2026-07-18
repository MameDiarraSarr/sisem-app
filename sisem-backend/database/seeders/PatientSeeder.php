<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\Pavillon;
use App\Models\Hospitalisation;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $pavillonM = Pavillon::where('nom', 'Pavillon M')->first();

        $amadou = Patient::create([
            'numero_dossier' => 'DOS-0001', 'prenom' => 'Amadou', 'nom' => 'Diop',
            'date_naissance' => '2018-03-12', 'sexe' => 'M',
            'telephone' => '771234567', 'mot_de_passe' => 'test123',
            'adresse' => 'Sicap Liberté 6', 'ville' => 'Dakar',
            'type_patient' => 'interne',
        ]);

        Hospitalisation::create([
            'patient_id' => $amadou->id,
            'pavillon_id' => $pavillonM->id,
            'date_debut' => now(),
            'date_fin' => null,
        ]);

        Patient::create([
            'numero_dossier' => null, 'prenom' => 'Fatou', 'nom' => 'Ndiaye',
            'date_naissance' => '2021-07-04', 'sexe' => 'F',
            'telephone' => '772345678', 'mot_de_passe' => 'test123',
            'adresse' => 'Grand Yoff', 'ville' => 'Dakar',
            'type_patient' => 'externe',
        ]);
    }
}