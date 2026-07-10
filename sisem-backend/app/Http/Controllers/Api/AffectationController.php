<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    public function index(Request $request)
    {
        $affectations = Affectation::with(['medecin.user', 'pavillon'])
            ->where('statut', 'active')
            ->get();

        return response()->json($affectations->map(fn ($a) => [
            'id' => $a->id,
            'medecin' => 'Dr. ' . $a->medecin->user->prenom . ' ' . $a->medecin->user->nom,
            'specialite' => $a->medecin->specialite,
            'pavillon' => $a->pavillon->nom,
            'date_debut' => $a->date_debut->format('d/m/Y'),
        ]));
    }

    public function store(Request $request)
    {
        $donnees = $request->validate([
            'medecin_id' => ['required', 'exists:medecins,id'],
            'pavillon_id' => ['required', 'exists:pavillons,id'],
        ]);

        // Éviter le doublon d'affectation active
        $existe = Affectation::where('medecin_id', $donnees['medecin_id'])
            ->where('pavillon_id', $donnees['pavillon_id'])
            ->where('statut', 'active')
            ->exists();

        if ($existe) {
            return response()->json([
                'message' => 'Ce médecin est déjà affecté à ce pavillon.',
            ], 422);
        }

        $affectation = Affectation::create([
            'medecin_id' => $donnees['medecin_id'],
            'pavillon_id' => $donnees['pavillon_id'],
            'date_debut' => now(),
            'statut' => 'active',
        ]);

        return response()->json(['message' => 'Affectation créée.', 'id' => $affectation->id], 201);
    }
}