<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Examen;

class ExamenController extends Controller
{
    // Le catalogue complet, avec les analyses de chaque examen
    public function index()
    {
        $examens = Examen::with('analyses')->orderBy('nom_examen')->get();

        return response()->json($examens->map(fn ($examen) => [
            'id' => $examen->id,
            'nom_examen' => $examen->nom_examen,
            'analyses' => $examen->analyses->map(fn ($a) => [
                'id' => $a->id,
                'nom_analyse' => $a->nom_analyse,
                'valeur_normale' => $a->valeur_normale,
                'unite' => $a->unite,
            ]),
        ]));
    }

    public function show(Examen $examen)
    {
        $examen->load('analyses');

        return response()->json([
            'id' => $examen->id,
            'nom_examen' => $examen->nom_examen,
            'analyses' => $examen->analyses->map(fn ($a) => [
                'id' => $a->id,
                'nom_analyse' => $a->nom_analyse,
                'valeur_normale' => $a->valeur_normale,
                'unite' => $a->unite,
            ]),
        ]);
    }
}