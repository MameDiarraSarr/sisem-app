<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BulletinExamen;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BulletinExamenController extends Controller
{
  // La liste dépend du rôle de celui qui demande
    public function index(Request $request)
    {
        $user = $request->user();

        $requete = BulletinExamen::with([
            'patient', 'pavillon',
            'medecin.user',
            'examenDemandes.examen',
        ]);

        // Chaque rôle voit ce qui le concerne, et rien d'autre
        match ($user->role) {
            'technicien' => $requete->where('statut', 'enregistre'),
            'biologiste' => $requete->whereIn('statut', ['saisi', 'valide']),
            'major' => $requete->where('statut', 'valide')
                                ->where('pavillon_id', $user->pavillon_id),
            'medecin' => $requete->where('statut', 'valide')
                                 ->whereIn('pavillon_id', $this->pavillonsDuMedecin($user)),
            default => null, // secrétaire et admin voient tout
        };

        if ($statut = $request->query('statut')) {
            $requete->where('statut', $statut);
        }

        // Filtre par patient (pour la fiche patient)
        if ($patientId = $request->query('patient_id')) {
            $requete->where('patient_id', $patientId);
        }

        $bulletins = $requete->orderByDesc('id')->get();

        return response()->json($bulletins->map(fn ($b) => $this->formater($b)));
    }

    // Compteur pour la cloche : nombre de bulletins que ce rôle doit encore traiter
    public function nombreATraiter(Request $request)
    {
        $user = $request->user();
        $requete = BulletinExamen::query();

        match ($user->role) {
            'technicien' => $requete->where('statut', 'enregistre'),   // à saisir
            'biologiste' => $requete->where('statut', 'saisi'),        // à valider
            'major' => $requete->where('statut', 'valide')
                                ->where('pavillon_id', $user->pavillon_id),
            'medecin' => $requete->where('statut', 'valide')
                                 ->whereIn('pavillon_id', $this->pavillonsDuMedecin($user)),
            default => $requete->whereRaw('1 = 0'), // secrétaire/admin : rien à traiter
        };

        return response()->json(['nombre' => $requete->count()]);
    }

    // Les pavillons où le médecin connecté a une affectation active
    private function pavillonsDuMedecin($user): array
    {
        $medecin = $user->medecin;

        if (! $medecin) {
            return []; // pas de médecin lié → aucun bulletin
        }

        return $medecin->affectations()
            ->where('statut', 'active')
            ->pluck('pavillon_id')
            ->all();
    }

    public function show(Request $request, BulletinExamen $bulletin)
    {
        $this->verifierAcces($request->user(), $bulletin);

        $bulletin->load([
            'patient', 'pavillon', 'medecin.user',
            'examenDemandes.examen.analyses',
            'examenDemandes.resultats.analyseReference',
        ]);

        return response()->json($this->formaterDetail($bulletin));
    }

    // Enregistre l'impression/remise d'un résultat par la secrétaire
    public function marquerImprime(BulletinExamen $bulletin)
    {
        // On ne trace que les résultats validés
        if ($bulletin->statut !== 'valide') {
            return response()->json([
                'message' => 'Seul un résultat validé peut être imprimé.',
            ], 422);
        }

        $bulletin->update([
            'imprime_le' => now(),
            'nombre_impressions' => $bulletin->nombre_impressions + 1,
        ]);

        return response()->json([
            'imprime_le' => $bulletin->imprime_le->format('d/m/Y à H\hi'),
            'nombre_impressions' => $bulletin->nombre_impressions,
        ]);
    }

    public function store(Request $request)
    {
        $donnees = $request->validate([
            'numero_labo' => ['required', 'string', 'max:50'],
            'patient_id' => ['required', 'exists:patients,id'],
            'medecin_id' => ['nullable', 'exists:medecins,id'],
            'indication_examen' => ['required', 'string'],
            'traitement_en_cours' => ['nullable', 'string', 'max:255'],
            'examens' => ['required', 'array', 'min:1'],
            'examens.*' => ['exists:examens,id'],
        ]);

        $patient = Patient::findOrFail($donnees['patient_id']);

        // Un patient externe n'a pas de prescripteur interne
        if ($patient->type_patient === 'externe' && ! empty($donnees['medecin_id'])) {
            return response()->json([
                'message' => 'Un patient externe ne peut pas avoir de médecin prescripteur.',
            ], 422);
        }

        $bulletin = DB::transaction(function () use ($donnees, $patient) {
            $bulletin = BulletinExamen::create([
                'numero_labo' => $donnees['numero_labo'],
                'patient_id' => $patient->id,
                'pavillon_id' => $patient->pavillon_id,
                'medecin_id' => $donnees['medecin_id'] ?? null,
                'indication_examen' => $donnees['indication_examen'],
                'traitement_en_cours' => $donnees['traitement_en_cours'] ?? null,
                'date_enregistrement' => now(),
                'statut' => 'enregistre',
            ]);

            foreach (array_unique($donnees['examens']) as $examenId) {
                $bulletin->examenDemandes()->create(['examen_id' => $examenId]);
            }

            return $bulletin;
        });

        $bulletin->load(['patient', 'pavillon', 'medecin.user', 'examenDemandes.examen']);

        return response()->json($this->formater($bulletin), 201);
    }

    // Le biologiste valide, ou renvoie au technicien
    public function valider(Request $request, BulletinExamen $bulletin)
    {
        if ($bulletin->statut !== 'saisi') {
            return response()->json([
                'message' => 'Seul un bulletin saisi peut être validé.',
            ], 422);
        }

        $bulletin->update(['statut' => 'valide']);

        // Le patient est notifié que ses résultats sont disponibles
        app(\App\Services\NotificationService::class)
            ->notifierResultatsDisponibles($bulletin->load('patient'));

        return response()->json(['message' => 'Bulletin validé.', 'statut' => 'valide']);
    }

    public function renvoyer(Request $request, BulletinExamen $bulletin)
    {
        if ($bulletin->statut !== 'saisi') {
            return response()->json([
                'message' => 'Seul un bulletin saisi peut être renvoyé.',
            ], 422);
        }

        $bulletin->update(['statut' => 'enregistre']);

        return response()->json(['message' => 'Bulletin renvoyé au technicien.', 'statut' => 'enregistre']);
    }

    // ─── Contrôle d'accès à un bulletin précis ───
    private function verifierAcces($user, BulletinExamen $bulletin): void
    {
        $autorise = match ($user->role) {
            'admin', 'secretaire' => true,
            'technicien' => $bulletin->statut === 'enregistre',
            'biologiste' => in_array($bulletin->statut, ['saisi', 'valide'], true),
            'major' => $bulletin->statut === 'valide' && $bulletin->pavillon_id === $user->pavillon_id,
            // Le médecin accède au bulletin validé si c'est un pavillon où il est affecté activement
            'medecin' => $bulletin->statut === 'valide'
                         && in_array($bulletin->pavillon_id, $this->pavillonsDuMedecin($user), true),
            default => false,
        };

        abort_unless($autorise, 403, 'Accès refusé.');
    }

   private function formater(BulletinExamen $b): array
    {
        return [
            'id' => $b->id,
            'numero_labo' => $b->numero_labo,
            'patient' => [
                'id' => $b->patient->id,
                'nom_complet' => $b->patient->prenom . ' ' . $b->patient->nom,
                'numero_dossier' => $b->patient->numero_dossier,
                'type_patient' => $b->patient->type_patient,
                'sexe' => $b->patient->sexe,
                'age' => $this->calculerAge($b->patient->date_naissance),
                'adresse' => $b->patient->adresse,
            ],
            'pavillon' => $b->pavillon?->nom,
            'medecin' => $b->medecin ? [
                'id' => $b->medecin->id,
                'nom_complet' => 'Dr. ' . $b->medecin->user->prenom . ' ' . $b->medecin->user->nom,
            ] : null,
            'indication_examen' => $b->indication_examen,
            'traitement_en_cours' => $b->traitement_en_cours,
            'date_enregistrement' => $b->date_enregistrement->format('d/m/Y'),
            'statut' => $b->statut,
            'imprime_le' => $b->imprime_le?->format('d/m/Y \à H\hi'),
            'nombre_impressions' => $b->nombre_impressions,
            'examens' => $b->examenDemandes->map(fn ($ed) => [
                'examen_demande_id' => $ed->id,
                'examen_id' => $ed->examen->id,
                'nom_examen' => $ed->examen->nom_examen,
            ]),
        ];
    }

    private function formaterDetail(BulletinExamen $b): array
    {
        $base = $this->formater($b);

        // Pour chaque examen demandé : ses analyses, et les valeurs saisies s'il y en a
        $base['examens'] = $b->examenDemandes->map(function ($ed) {
            $resultats = $ed->resultats->keyBy('analyse_reference_id');

            return [
                'examen_demande_id' => $ed->id,
                'examen_id' => $ed->examen->id,
                'nom_examen' => $ed->examen->nom_examen,
                'analyses' => $ed->examen->analyses->map(fn ($a) => [
                    'analyse_reference_id' => $a->id,
                    'nom_analyse' => $a->nom_analyse,
                    'valeur_normale' => $a->valeur_normale,
                    'unite' => $a->unite,
                    'valeur_resultat' => $resultats->get($a->id)?->valeur_resultat,
                ]),
            ];
        });

        return $base;
    }

    private function calculerAge($naissance): ?string
    {
        if (! $naissance) {
            return null;
        }
        $date = $naissance instanceof \Illuminate\Support\Carbon
            ? $naissance
            : \Illuminate\Support\Carbon::parse($naissance);
        $mois = (int) $date->diffInMonths(now());
        if ($mois < 12) {
            return $mois . ' mois';
        }
        $ans = (int) $date->diffInYears(now());
        return $ans . ($ans > 1 ? ' ans' : ' an');
    }
}