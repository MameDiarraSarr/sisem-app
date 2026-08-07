<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthPatientController extends Controller
{
    public function connexion(Request $request)
    {
        $donnees = $request->validate([
            'telephone' => ['required', 'string'],
            'mot_de_passe' => ['required', 'string'],
        ]);

        // On cherche l'utilisateur par téléphone (table utilisateurs), puis le patient lié
        $utilisateur = Utilisateur::where('telephone', $donnees['telephone'])->first();
        $patient = $utilisateur?->patient;

        if (! $patient || ! Hash::check($donnees['mot_de_passe'], $utilisateur->mot_de_passe)) {
            throw ValidationException::withMessages([
                'telephone' => ['Numéro ou mot de passe incorrect.'],
            ]);
        }

        $token = $patient->createToken('patient')->plainTextToken;

        return response()->json([
            'token' => $token,
            'patient' => [
                'id' => $patient->id,
                'prenom' => $patient->prenom,
                'nom' => $patient->nom,
                'telephone' => $patient->telephone,
                'numero_dossier' => $patient->numero_dossier,
                'mot_de_passe_temporaire' => $patient->mot_de_passe_temporaire,
            ],
        ]);
    }

    public function deconnexion(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function moi(Request $request)
    {
        $patient = $request->user();

        return response()->json([
            'id' => $patient->id,
            'prenom' => $patient->prenom,
            'nom' => $patient->nom,
            'telephone' => $patient->telephone,
            'numero_dossier' => $patient->numero_dossier,
        ]);
    }
}