<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BulletinExamen;
use Illuminate\Http\Request;

class PatientEspaceController extends Controller
{
    // La liste des bulletins validés du patient connecté
    public function mesResultats(Request $request)
    {
        $patient = $request->user();

        $bulletins = BulletinExamen::where('patient_id', $patient->id)
            ->where('statut', 'valide')
            ->with(['medecin.user', 'examenDemandes.examen'])
            ->orderByDesc('date_enregistrement')
            ->get();

        return response()->json($bulletins->map(fn ($b) => [
            'id' => $b->id,
            'numero_labo' => $b->numero_labo,
            'date' => $b->date_enregistrement->format('d/m/Y'),
            'medecin' => $b->medecin
                ? 'Dr. ' . $b->medecin->user->prenom . ' ' . $b->medecin->user->nom
                : null,
            'examens' => $b->examenDemandes->map(fn ($ed) => $ed->examen->nom_examen),
        ]));
    }

    // Le détail d'un bulletin — uniquement s'il appartient au patient et s'il est validé
    public function detailResultat(Request $request, BulletinExamen $bulletin)
    {
        $patient = $request->user();

        // Double barrière : le bon patient, ET un bulletin validé
        abort_unless(
            $bulletin->patient_id === $patient->id && $bulletin->statut === 'valide',
            403,
            'Accès refusé.'
        );

        $bulletin->load([
            'medecin.user',
            'examenDemandes.examen.analyses',
            'examenDemandes.resultats.analyseReference',
        ]);

        return response()->json([
            'id' => $bulletin->id,
            'numero_labo' => $bulletin->numero_labo,
            'date' => $bulletin->date_enregistrement->format('d/m/Y'),
            'numero_dossier' => $patient->numero_dossier,
            'patient' => $patient->prenom . ' ' . $patient->nom,
            'medecin' => $bulletin->medecin
                ? 'Dr. ' . $bulletin->medecin->user->prenom . ' ' . $bulletin->medecin->user->nom
                : null,
            'examens' => $bulletin->examenDemandes->map(function ($ed) {
                $resultats = $ed->resultats->keyBy('analyse_reference_id');

                return [
                    'nom_examen' => $ed->examen->nom_examen,
                    'analyses' => $ed->examen->analyses->map(fn ($a) => [
                        'nom_analyse' => $a->nom_analyse,
                        'valeur_normale' => $a->valeur_normale,
                        'unite' => $a->unite,
                        'valeur_resultat' => $resultats->get($a->id)?->valeur_resultat,
                    ]),
                ];
            }),
        ]);
    }
}
