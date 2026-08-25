<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medecin;
use App\Models\Personnel;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class PersonnelController extends Controller
{
    public function index(Request $request)
    {
        $recherche = $request->query('recherche');

        $personnel = Personnel::with('pavillon', 'medecin')
            ->when($recherche, function ($query, $terme) {
                $query->where(function ($q) use ($terme) {
                    $q->where('matricule', 'ilike', "%{$terme}%")
                      ->orWhereHas('utilisateur', function ($u) use ($terme) {
                          $u->where('prenom', 'ilike', "%{$terme}%")
                            ->orWhere('nom', 'ilike', "%{$terme}%")
                            ->orWhere('email', 'ilike', "%{$terme}%");
                      });
                });
            })
            ->orderByDesc('id')
            ->get();

        return response()->json($personnel->map(fn ($u) => $this->formater($u)));
    }

    public function store(Request $request)
    {
        $donnees = $request->validate([
            'prenom' => ['required', 'string', 'max:100'],
            'nom' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:utilisateurs,email'],
            'telephone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', Rule::in(['admin', 'secretaire', 'technicien', 'biologiste', 'medecin', 'major'])],
            'pavillon_id' => ['nullable', 'exists:pavillons,id'],
            'specialite' => ['nullable', 'string', 'max:150'],
        ]);

        // Le major est rattaché à un pavillon
        if ($donnees['role'] === 'major' && empty($donnees['pavillon_id'])) {
            return response()->json([
                'message' => 'Un major doit être rattaché à un pavillon.',
            ], 422);
        }

        $user = DB::transaction(function () use ($donnees) {
            $utilisateur = Utilisateur::create([
                'prenom' => $donnees['prenom'],
                'nom' => $donnees['nom'],
                'email' => $donnees['email'],
                'telephone' => $donnees['telephone'] ?? null,
                'mot_de_passe' => 'test123', // provisoire, changé à la 1re connexion
            ]);

            // Le pavillon_id du compte ne sert qu'au major.
            // Pour un médecin, le pavillon se gère uniquement via les affectations.
            $pavillonCompte = $donnees['role'] === 'major' ? ($donnees['pavillon_id'] ?? null) : null;

            $user = Personnel::create([
                'id' => $utilisateur->id,
                'matricule' => $this->genererMatricule($donnees['role']),
                'role' => $donnees['role'],
                'statut' => 'debloque',
                'pavillon_id' => $pavillonCompte,
            ]);

            if ($donnees['role'] === 'medecin') {
                $medecin = Medecin::create([
                    'user_id' => $user->id,
                    'specialite' => $donnees['specialite'] ?? null,
                ]);
                $user->medecin_id_cree = $medecin->id; // pour la redirection vers Affectations
                // Pas d'affectation ici : l'admin sera redirigé vers l'écran Affectations.
            }

            return $user;
        });

        $user->load('pavillon');

        $reponse = $this->formater($user);
        $reponse['medecin_id'] = $user->medecin_id_cree ?? null;

        return response()->json($reponse, 201);
    }

    public function update(Request $request, Personnel $user)
    {
        $donnees = $request->validate([
            'prenom' => ['required', 'string', 'max:100'],
            'nom' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', Rule::unique('utilisateurs', 'email')->ignore($user->id)],
            'telephone' => ['nullable', 'string', 'max:20'],
            'pavillon_id' => ['nullable', 'exists:pavillons,id'],
            'specialite' => ['nullable', 'string', 'max:150'],
        ]);

        // Le major reste rattaché à un pavillon
        if ($user->role === 'major' && empty($donnees['pavillon_id'])) {
            return response()->json([
                'message' => 'Un major doit être rattaché à un pavillon.',
            ], 422);
        }

        DB::transaction(function () use ($user, $donnees) {
            // Champs communs → utilisateurs
            $user->utilisateur->update([
                'prenom' => $donnees['prenom'],
                'nom' => $donnees['nom'],
                'email' => $donnees['email'],
                'telephone' => $donnees['telephone'] ?? null,
            ]);

            // Le pavillon_id du compte ne concerne que le major (pour un médecin, il reste inchangé/null)
            if ($user->role === 'major') {
                $user->update(['pavillon_id' => $donnees['pavillon_id'] ?? null]);
            }

            // Si médecin, mettre à jour sa spécialité
            if ($user->role === 'medecin' && array_key_exists('specialite', $donnees)) {
                $user->medecin?->update(['specialite' => $donnees['specialite']]);
            }
        });

        $user->refresh();
        $user->load('pavillon');

        return response()->json($this->formater($user));
    }

    // Activer / désactiver — on ne supprime jamais un compte (traçabilité)
    public function changerStatut(Request $request, Personnel $user)
    {
        $nouveau = $user->statut === 'debloque' ? 'bloque' : 'debloque';
        $user->update(['statut' => $nouveau]);

        return response()->json(['message' => 'Statut mis à jour.', 'statut' => $nouveau]);
    }

    private function genererMatricule(string $role): string
    {
        $prefixes = [
            'admin' => 'ADM', 'secretaire' => 'SEC', 'technicien' => 'TEC',
            'biologiste' => 'BIO', 'medecin' => 'MED', 'major' => 'MAJ',
        ];

        $prefixe = $prefixes[$role];
        $count = Personnel::where('role', $role)->count() + 1;

        return $prefixe . '-' . str_pad((string) $count, 3, '0', STR_PAD_LEFT);
    }

    private function formater(Personnel $u): array
    {
        return [
            'id' => $u->id,
            'matricule' => $u->matricule,
            'prenom' => $u->prenom,
            'nom' => $u->nom,
            'email' => $u->email,
            'telephone' => $u->telephone,
            'role' => $u->role,
            'statut' => $u->statut,
            'pavillon' => $u->pavillon?->nom,
            'pavillon_id' => $u->pavillon_id,
            'specialite' => $u->medecin?->specialite,
        ];
    }
}