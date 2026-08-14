<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $recherche = $request->query('recherche');

        $patients = Patient::with('pavillon')
            ->when($recherche, function ($query, $terme) {
                $query->where(function ($q) use ($terme) {
                    $q->where('numero_dossier', 'ilike', "%{$terme}%")
                      ->orWhereHas('utilisateur', function ($u) use ($terme) {
                          $u->where('prenom', 'ilike', "%{$terme}%")
                            ->orWhere('nom', 'ilike', "%{$terme}%")
                            ->orWhere('telephone', 'ilike', "%{$terme}%");
                      });
                });
            })
            ->orderByDesc('id')
            ->get();

        return response()->json($patients->map(fn ($p) => $this->formater($p)));
    }

    public function show(Patient $patient)
    {
        $patient->load('pavillon');

        return response()->json($this->formater($patient));
    }

    public function store(Request $request)
    {
        $donnees = $request->validate([
            'prenom' => ['required', 'string', 'max:100'],
            'nom' => ['required', 'string', 'max:100'],
            'date_naissance' => ['nullable', 'date', 'before:today'],
            'age_valeur' => ['nullable', 'integer', 'min:0', 'max:120'],
            'age_unite' => ['nullable', Rule::in(['ans', 'mois'])],
            'sexe' => ['required', Rule::in(['M', 'F'])],
            'telephone' => ['required', 'string', 'max:20', 'unique:utilisateurs,telephone'],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'ville' => ['nullable', 'string', 'max:100'],
            'type_patient' => ['required', Rule::in(['interne', 'externe'])],
            'pavillon_id' => ['nullable', 'exists:pavillons,id'],
        ]);

        if (empty($donnees['date_naissance']) && empty($donnees['age_valeur'])) {
            return response()->json([
                'message' => 'Veuillez indiquer la date de naissance ou l\'âge du patient.',
            ], 422);
        }

        if (empty($donnees['date_naissance']) && ! empty($donnees['age_valeur'])) {
            $donnees['date_naissance'] = ($donnees['age_unite'] ?? 'ans') === 'mois'
                ? now()->subMonths($donnees['age_valeur'])->toDateString()
                : now()->subYears($donnees['age_valeur'])->toDateString();
        }

        unset($donnees['age_valeur'], $donnees['age_unite']);

        // Un patient interne doit avoir un pavillon ; un externe n'en a pas.
        $pavillonId = null;
        if ($donnees['type_patient'] === 'interne') {
            if (empty($donnees['pavillon_id'])) {
                return response()->json([
                    'message' => 'Un patient interne doit être rattaché à un pavillon.',
                ], 422);
            }
            $pavillonId = $donnees['pavillon_id'];
        }
        unset($donnees['pavillon_id']);

        $numeroDossier = $this->genererNumeroDossier();

        $patient = DB::transaction(function () use ($donnees, $pavillonId, $numeroDossier) {
            // 1. L'utilisateur (identité + identifiants de connexion)
            $utilisateur = Utilisateur::create([
                'prenom' => $donnees['prenom'],
                'nom' => $donnees['nom'],
                'date_naissance' => $donnees['date_naissance'],
                'sexe' => $donnees['sexe'],
                'telephone' => $donnees['telephone'],
                'email' => $donnees['email'] ?? null,
                'adresse' => $donnees['adresse'] ?? null,
                'mot_de_passe' => $donnees['telephone'], // provisoire, à changer à la 1re connexion
            ]);

            // 2. Le patient lié (même id, clé partagée) — pavillon direct
            $patient = Patient::create([
                'id' => $utilisateur->id,
                'numero_dossier' => $numeroDossier,
                'type_patient' => $donnees['type_patient'],
                'ville' => $donnees['ville'] ?? null,
                'pavillon_id' => $pavillonId,
            ]);

            return $patient;
        });

        $patient->load('pavillon');

        return response()->json($this->formater($patient), 201);
    }

    public function update(Request $request, Patient $patient)
    {
        $donnees = $request->validate([
            'prenom' => ['required', 'string', 'max:100'],
            'nom' => ['required', 'string', 'max:100'],
            'date_naissance' => ['nullable', 'date', 'before:today'],
            'age_valeur' => ['nullable', 'integer', 'min:0', 'max:120'],
            'age_unite' => ['nullable', Rule::in(['ans', 'mois'])],
            'sexe' => ['required', Rule::in(['M', 'F'])],
            'telephone' => ['required', 'string', 'max:20', Rule::unique('utilisateurs', 'telephone')->ignore($patient->id)],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'ville' => ['nullable', 'string', 'max:100'],
            'pavillon_id' => ['nullable', 'exists:pavillons,id'],
        ]);

        if (empty($donnees['date_naissance']) && ! empty($donnees['age_valeur'])) {
            $donnees['date_naissance'] = ($donnees['age_unite'] ?? 'ans') === 'mois'
                ? now()->subMonths($donnees['age_valeur'])->toDateString()
                : now()->subYears($donnees['age_valeur'])->toDateString();
        }

        unset($donnees['age_valeur'], $donnees['age_unite']);

        DB::transaction(function () use ($patient, $donnees) {
            // Champs communs → table utilisateurs
            $patient->utilisateur->update([
                'prenom' => $donnees['prenom'],
                'nom' => $donnees['nom'],
                'date_naissance' => $donnees['date_naissance'] ?? $patient->utilisateur->date_naissance,
                'sexe' => $donnees['sexe'],
                'telephone' => $donnees['telephone'],
                'email' => $donnees['email'] ?? null,
                'adresse' => $donnees['adresse'] ?? null,
            ]);

            // Champs propres au patient → table patients (dont le pavillon, pour un interne)
            $majPatient = ['ville' => $donnees['ville'] ?? null];
            if ($patient->type_patient === 'interne') {
                $majPatient['pavillon_id'] = $donnees['pavillon_id'] ?? $patient->pavillon_id;
            }
            $patient->update($majPatient);
        });

        $patient->refresh();
        $patient->load('pavillon');

        return response()->json($this->formater($patient));
    }

    private function genererNumeroDossier(): string
    {
        $dernier = Patient::whereNotNull('numero_dossier')
            ->orderByDesc('numero_dossier')
            ->value('numero_dossier');

        $numero = $dernier ? ((int) substr($dernier, 4)) + 1 : 1;

        return 'DOS-' . str_pad((string) $numero, 4, '0', STR_PAD_LEFT);
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

    private function formater(Patient $p): array
    {
        return [
            'id' => $p->id,
            'numero_dossier' => $p->numero_dossier,
            'prenom' => $p->prenom,
            'nom' => $p->nom,
            'date_naissance' => $p->date_naissance?->format('Y-m-d'),
            'age' => $this->calculerAge($p->date_naissance),
            'sexe' => $p->sexe,
            'telephone' => $p->telephone,
            'email' => $p->email,
            'adresse' => $p->adresse,
            'ville' => $p->ville,
            'type_patient' => $p->type_patient,
            'pavillon' => $p->pavillon?->nom,
            'pavillon_id' => $p->pavillon_id,
            'date_enregistrement' => $p->created_at->format('d/m/Y'),
        ];
    }
}