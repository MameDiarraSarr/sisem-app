<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BulletinExamen;
use App\Models\ExamenDemande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResultatController extends Controller
{
    // Le technicien saisit les valeurs d'un bulletin, puis le passe en "saisi"
    public function saisir(Request $request, BulletinExamen $bulletin)
    {
        // On ne saisit que sur un bulletin encore au stade "enregistre"
        if ($bulletin->statut !== 'enregistre') {
            return response()->json([
                'message' => 'Ce bulletin n\'est plus au stade de saisie.',
            ], 422);
        }

        $donnees = $request->validate([
            'resultats' => ['required', 'array', 'min:1'],
            'resultats.*.examen_demande_id' => ['required', 'exists:examen_demandes,id'],
            'resultats.*.analyse_reference_id' => ['required', 'exists:analyse_references,id'],
            'resultats.*.valeur_resultat' => ['required', 'string', 'max:255'],
        ]);

        // Vérifier que chaque examen_demande appartient bien à CE bulletin
        $demandesDuBulletin = $bulletin->examenDemandes->pluck('id')->all();

        foreach ($donnees['resultats'] as $ligne) {
            if (! in_array($ligne['examen_demande_id'], $demandesDuBulletin, true)) {
                return response()->json([
                    'message' => 'Un résultat ne correspond pas à ce bulletin.',
                ], 422);
            }
        }

        DB::transaction(function () use ($donnees, $bulletin) {
            foreach ($donnees['resultats'] as $ligne) {
                // updateOrCreate : si le technicien corrige, on écrase au lieu de dupliquer
                $demande = ExamenDemande::find($ligne['examen_demande_id']);
                $demande->resultats()->updateOrCreate(
                    ['analyse_reference_id' => $ligne['analyse_reference_id']],
                    ['valeur_resultat' => $ligne['valeur_resultat'], 'date_resultat' => now()]
                );
            }

            $bulletin->update(['statut' => 'saisi']);
        });

        return response()->json([
            'message' => 'Résultats enregistrés. Bulletin transmis au biologiste.',
            'statut' => 'saisi',
        ]);
    }
}