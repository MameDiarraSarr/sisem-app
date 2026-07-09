<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\Pavillon;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $pavillonM = Pavillon::where('nom', 'Pavillon M')->first();

        Patient::create([
            'numero_dossier' => 'DOS-0001', 'prenom' => 'Amadou', 'nom' => 'Diop',
            'date_naissance' => '2018-03-12', 'sexe' => 'M',
            'telephone' => '771234567', 'mot_de_passe' => 'test123',
            'adresse' => 'Sicap Liberté 6', 'ville' => 'Dakar',
            'type_patient' => 'interne', 'pavillon_id' => $pavillonM->id,
        ]);

        Patient::create([
            'numero_dossier' => 'DOS-0002', 'prenom' => 'Fatou', 'nom' => 'Ndiaye',
            'date_naissance' => '2021-07-04', 'sexe' => 'F',
            'telephone' => '772345678', 'mot_de_passe' => 'test123',
            'adresse' => 'Grand Yoff', 'ville' => 'Dakar',
            'type_patient' => 'externe', 'pavillon_id' => null,
        ]);
    }
}