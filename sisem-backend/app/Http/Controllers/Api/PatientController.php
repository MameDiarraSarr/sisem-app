<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Hospitalisation;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $recherche = $request->query('recherche');

        $patients = Patient::with('hospitalisationActive.pavillon')
            ->when($recherche, function ($query, $terme) {
                $query->where(function ($q) use ($terme) {
                    $q->where('prenom', 'ilike', "%{$terme}%")
                      ->orWhere('nom', 'ilike', "%{$terme}%")
                      ->orWhere('numero_dossier', 'ilike', "%{$terme}%")
                      ->orWhere('telephone', 'ilike', "%{$terme}%");
                });
            })
            ->orderByDesc('id')
            ->get();

        return response()->json($patients->map(fn ($p) => $this->formater($p)));
    }

    public function show(Patient $patient)
    {
        $patient->load('hospitalisationActive.pavillon');

        return response()->json($this->formater($patient));
    }

    public function store(Request $request)
    {
        $donnees = $request->validate([
            'prenom' => ['required', 'string', 'max:100'],
            'nom' => ['required', 'string', 'max:100'],
            // Soit une date de naissance, soit un âge (l'un des deux requis, vérifié plus bas)
            'date_naissance' => ['nullable', 'date', 'before:today'],
            'age_valeur' => ['nullable', 'integer', 'min:0', 'max:120'],
            'age_unite' => ['nullable', Rule::in(['ans', 'mois'])],
            // Le sexe est obligatoire
            'sexe' => ['required', Rule::in(['M', 'F'])],
            'telephone' => ['required', 'string', 'max:20', 'unique:patients,telephone'],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'ville' => ['nullable', 'string', 'max:100'],
            'type_patient' => ['required', Rule::in(['interne', 'externe'])],
            'pavillon_id' => ['nullable', 'exists:pavillons,id'],
        ]);

        // Il faut soit la date de naissance, soit l'âge
        if (empty($donnees['date_naissance']) && empty($donnees['age_valeur'])) {
            return response()->json([
                'message' => 'Veuillez indiquer la date de naissance ou l\'âge du patient.',
            ], 422);
        }

        // Si seul l'âge est fourni, on en déduit une date de naissance approximative
        if (empty($donnees['date_naissance']) && ! empty($donnees['age_valeur'])) {
            $donnees['date_naissance'] = ($donnees['age_unite'] ?? 'ans') === 'mois'
                ? now()->subMonths($donnees['age_valeur'])->toDateString()
                : now()->subYears($donnees['age_valeur'])->toDateString();
        }

        // Ces deux champs ne sont pas des colonnes de la table
        unset($donnees['age_valeur'], $donnees['age_unite']);

        // Un patient interne doit être rattaché à un pavillon
        $pavillonId = null;
        if ($donnees['type_patient'] === 'interne') {
            if (empty($donnees['pavillon_id'])) {
                return response()->json([
                    'message' => 'Un patient interne doit être rattaché à un pavillon.',
                ], 422);
            }
            $pavillonId = $donnees['pavillon_id'];
        }

        // Le pavillon ne se stocke plus sur le patient : il devient une hospitalisation datée
        unset($donnees['pavillon_id']);

        $donnees['numero_dossier'] = $donnees['type_patient'] === 'interne'
            ? $this->genererNumeroDossier()
            : null;
        $donnees['mot_de_passe'] = $donnees['telephone']; // provisoire, à changer à la 1re connexion

        $patient = DB::transaction(function () use ($donnees, $pavillonId) {
            $patient = Patient::create($donnees);

            // Si interne : on ouvre une hospitalisation active dans son pavillon
            if ($pavillonId) {
                Hospitalisation::create([
                    'patient_id' => $patient->id,
                    'pavillon_id' => $pavillonId,
                    'date_debut' => now(),
                    'date_fin' => null,
                ]);
            }

            return $patient;
        });

        $patient->load('hospitalisationActive.pavillon');

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
            'telephone' => ['required', 'string', 'max:20', Rule::unique('patients', 'telephone')->ignore($patient->id)],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'ville' => ['nullable', 'string', 'max:100'],
        ]);

        // Si l'âge est fourni (et pas la date), on recalcule la date de naissance
        if (empty($donnees['date_naissance']) && ! empty($donnees['age_valeur'])) {
            $donnees['date_naissance'] = ($donnees['age_unite'] ?? 'ans') === 'mois'
                ? now()->subMonths($donnees['age_valeur'])->toDateString()
                : now()->subYears($donnees['age_valeur'])->toDateString();
        }

        unset($donnees['age_valeur'], $donnees['age_unite']);

        $patient->update($donnees);
        $patient->load('hospitalisationActive.pavillon');

        return response()->json($this->formater($patient));
    }

    private function genererNumeroDossier(): string
    {
        // On ignore les externes (numero_dossier null) et on lit le dernier
        // numéro réellement attribué, pas le dernier id.
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
        $hospit = $p->hospitalisationActive;

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
            'pavillon' => $hospit?->pavillon?->nom,
            'pavillon_id' => $hospit?->pavillon_id,
            'date_enregistrement' => $p->created_at->format('d/m/Y'),
        ];
    }
}