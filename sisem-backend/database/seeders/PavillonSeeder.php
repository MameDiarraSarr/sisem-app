<?php

namespace Database\Seeders;

use App\Models\Pavillon;
use Illuminate\Database\Seeder;

class PavillonSeeder extends Seeder
{
    public function run(): void
    {
        $pavillons = [
            'Pavillon M', 'Pavillon N', 'Pavillon O', 'Pavillon K',
            'USAD', 'SAU', 'Dermatologie', 'Esther', 'Chirurgie', 'Chirurgie Pédiatrique',
        ];

        foreach ($pavillons as $nom) {
            Pavillon::create(['nom' => $nom]);
        }
    }
}