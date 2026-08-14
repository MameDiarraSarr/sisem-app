<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BulletinExamen;
use Illuminate\Http\Request;

class PatientEspaceController extends Controller
{
    public function mesResultats(Request $request)
    {
        $patient = $request->user();

        $bulletins = BulletinExamen::where('patient_id', $patient->id)
            ->where('statut', 'valide')
            ->with([
                'medecin.user',
                'examenDemandes.examen.analyses',
                'examenDemandes.resultats.analyseReference',
            ])
            ->orderByDesc('date_enregistrement')
            ->get();

        $resultats = [];

        foreach ($bulletins as $b) {
            $medecin = $b->medecin
                ? 'Dr. ' . $b->medecin->user->prenom . ' ' . $b->medecin->user->nom
                : null;

            // Chaque examen du bulletin devient une SECTION de la feuille
            $examens = [];
            foreach ($b->examenDemandes as $ed) {
                $valeurs = $ed->resultats->keyBy('analyse_reference_id');

                $examens[] = [
                    'examenNom' => $ed->examen->nom_examen,
                    'analyses' => $ed->examen->analyses->map(fn ($a) => [
                        'nom' => $a->nom_analyse,
                        'valeur' => (string) ($valeurs->get($a->id)?->valeur_resultat ?? ''),
                        'unite' => $a->unite,
                        'valeurReference' => $a->valeur_normale,
                    ])->values(),
                ];
            }

            // UN seul résultat par BULLETIN (une seule feuille avec tous les examens)
            $resultats[] = [
                'id' => $b->id,                        // id du bulletin
                'patientId' => $patient->id,
                'numeroDossier' => $patient->numero_dossier,
                'numeroLabo' => $b->numero_labo,
                'sexe' => $patient->sexe,
                'age' => $this->calculerAge($patient->date_naissance),
                'adresse' => $patient->adresse,
                'medecinPrescripteur' => $medecin,
                'dateResultat' => $b->date_enregistrement->format('d/m/Y'),
                'statut' => 'valide',
                'commentaire' => '',
                'examens' => $examens,
            ];
        }

        return response()->json($resultats);
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

    public function mesNotifications(Request $request)
    {
        $patient = $request->user();

        $notifications = \App\Models\Notification::where('patient_id', $patient->id)
            ->orderByDesc('id')
            ->get();

        return response()->json($notifications->map(fn ($n) => [
            'id' => $n->id,
            'message' => $n->message,
            'lien' => $n->lien,
            'lu' => $n->lu,
            'date' => $n->created_at->format('d/m/Y H:i'),
        ]));
    }

    public function marquerLue(Request $request, \App\Models\Notification $notification)
    {
        abort_unless($notification->patient_id === $request->user()->id, 403, 'Accès refusé.');

        $notification->update(['lu' => true]);

        return response()->json(['message' => 'Notification lue.']);
    }

    // En pédiatrie : mois avant 1 an, années ensuite
    private function calculerAge(?\Illuminate\Support\Carbon $naissance): ?string
    {
        if (! $naissance) {
            return null;
        }
        $mois = (int) $naissance->diffInMonths(now());
        if ($mois < 12) {
            return $mois . ' mois';
        }
        $ans = (int) $naissance->diffInYears(now());
        return $ans . ($ans > 1 ? ' ans' : ' an');
    }
}

