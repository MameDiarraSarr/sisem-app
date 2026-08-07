<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfilController extends Controller
{
    // Consulter son propre profil (personnel ou patient)
    public function afficher(Request $request)
    {
        $u = $request->user();

        if ($u instanceof Patient) {
            return response()->json([
                'type' => 'patient',
                'id' => $u->id,
                'prenom' => $u->prenom,
                'nom' => $u->nom,
                'telephone' => $u->telephone,
                'email' => $u->email,
                'adresse' => $u->adresse,
                'ville' => $u->ville,
                'numero_dossier' => $u->numero_dossier,
            ]);
        }

        return response()->json([
            'type' => 'personnel',
            'id' => $u->id,
            'prenom' => $u->prenom,
            'nom' => $u->nom,
            'email' => $u->email,
            'telephone' => $u->telephone,
            'adresse' => $u->adresse,
            'role' => $u->role,
            'matricule' => $u->matricule,
        ]);
    }

    // Modifier ses infos de contact
    public function modifier(Request $request)
    {
        $u = $request->user();

        if ($u instanceof Patient) {
            $donnees = $request->validate([
                'telephone' => ['required', 'string', 'max:20', Rule::unique('utilisateurs', 'telephone')->ignore($u->id)],
                'email' => ['nullable', 'email', 'max:150'],
                'adresse' => ['nullable', 'string', 'max:255'],
                'ville' => ['nullable', 'string', 'max:100'],
            ]);

            // La ville est propre au patient, le reste va dans utilisateurs
            $u->update(['ville' => $donnees['ville'] ?? $u->ville]);
            $u->utilisateur->update([
                'telephone' => $donnees['telephone'],
                'email' => $donnees['email'] ?? null,
                'adresse' => $donnees['adresse'] ?? null,
            ]);
        } else {
            $donnees = $request->validate([
                'email' => ['required', 'email', 'max:150', Rule::unique('utilisateurs', 'email')->ignore($u->id)],
                'telephone' => ['nullable', 'string', 'max:20'],
                'adresse' => ['nullable', 'string', 'max:255'],
            ]);

            // Tous ces champs sont dans utilisateurs
            $u->utilisateur->update([
                'email' => $donnees['email'],
                'telephone' => $donnees['telephone'] ?? null,
                'adresse' => $donnees['adresse'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Profil mis à jour.']);
    }
}