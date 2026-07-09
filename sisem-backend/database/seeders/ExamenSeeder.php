<?php

namespace Database\Seeders;

use App\Models\Examen;
use Illuminate\Database\Seeder;

class ExamenSeeder extends Seeder
{
    public function run(): void
    {
        $catalogue = [
            'Hémogramme' => [
                ['nom_analyse' => 'Hémoglobine',      'valeur_normale' => '12 - 16',            'unite' => 'g/dL'],
                ['nom_analyse' => 'Globules blancs',  'valeur_normale' => '4000 - 10000',       'unite' => '/mm³'],
                ['nom_analyse' => 'Plaquettes',       'valeur_normale' => '150000 - 400000',    'unite' => '/mm³'],
                ['nom_analyse' => 'Hématocrite',      'valeur_normale' => '37 - 47',            'unite' => '%'],
            ],
            'Glycémie' => [
                ['nom_analyse' => 'Glucose à jeun',   'valeur_normale' => '0.70 - 1.10',        'unite' => 'g/L'],
            ],
            'Bilan rénal' => [
                ['nom_analyse' => 'Créatinine',       'valeur_normale' => '6 - 12',             'unite' => 'mg/L'],
                ['nom_analyse' => 'Urée',             'valeur_normale' => '0.15 - 0.45',        'unite' => 'g/L'],
            ],
            'Ionogramme' => [
                ['nom_analyse' => 'Sodium (Na+)',     'valeur_normale' => '135 - 145',          'unite' => 'mmol/L'],
                ['nom_analyse' => 'Potassium (K+)',   'valeur_normale' => '3.5 - 5.0',          'unite' => 'mmol/L'],
                ['nom_analyse' => 'Chlore (Cl-)',     'valeur_normale' => '98 - 107',           'unite' => 'mmol/L'],
            ],
            'CRP' => [
                ['nom_analyse' => 'Protéine C-réactive', 'valeur_normale' => '0 - 6',           'unite' => 'mg/L'],
            ],
            'Sérologie' => [
                ['nom_analyse' => 'Résultat sérologique', 'valeur_normale' => 'Négatif',        'unite' => null],
            ],
        ];

        foreach ($catalogue as $nomExamen => $analyses) {
            $examen = Examen::create(['nom_examen' => $nomExamen]);
            $examen->analyses()->createMany($analyses);
        }
    }
}