<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $recherche = $request->query('recherche');

        $patients = Patient::with('pavillon')
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
        $patient->load('pavillon');

        return response()->json($this->formater($patient));
    }

    public function store(Request $request)
    {
        $donnees = $request->validate([
            'prenom' => ['required', 'string', 'max:100'],
            'nom' => ['required', 'string', 'max:100'],
            'date_naissance' => ['nullable', 'date', 'before:today'],
            'sexe' => ['nullable', Rule::in(['M', 'F'])],
            'telephone' => ['required', 'string', 'max:20', 'unique:patients,telephone'],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'ville' => ['nullable', 'string', 'max:100'],
            'type_patient' => ['required', Rule::in(['interne', 'externe'])],
            'pavillon_id' => ['nullable', 'exists:pavillons,id'],
        ]);

        // Un patient externe n'a pas de pavillon
        if ($donnees['type_patient'] === 'externe') {
            $donnees['pavillon_id'] = null;
        } elseif (empty($donnees['pavillon_id'])) {
            return response()->json([
                'message' => 'Un patient interne doit être rattaché à un pavillon.',
            ], 422);
        }

        $donnees['numero_dossier'] = $this->genererNumeroDossier();
        $donnees['mot_de_passe'] = $donnees['telephone']; // provisoire, à changer à la 1re connexion

        $patient = Patient::create($donnees);
        $patient->load('pavillon');

        return response()->json($this->formater($patient), 201);
    }

    private function genererNumeroDossier(): string
    {
        // On lit le dernier numéro existant, pas le dernier id :
        // une suppression laisserait un trou et produirait un doublon.
        $dernier = Patient::orderByDesc('numero_dossier')->value('numero_dossier');
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