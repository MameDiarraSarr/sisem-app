<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class MotDePasseController extends Controller
{
    public function changer(Request $request)
    {
        $donnees = $request->validate([
            'ancien_mot_de_passe' => ['required', 'string'],
            'nouveau_mot_de_passe' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        // Personnel comme patient : l'identité (dont le mot de passe) est dans utilisateurs
        $compte = $request->user();
        $utilisateur = $compte->utilisateur;

        if (! Hash::check($donnees['ancien_mot_de_passe'], $utilisateur->mot_de_passe)) {
            throw ValidationException::withMessages([
                'ancien_mot_de_passe' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $utilisateur->mot_de_passe = $donnees['nouveau_mot_de_passe'];
        $utilisateur->mot_de_passe_temporaire = false;
        $utilisateur->save();

        return response()->json(['message' => 'Mot de passe modifié.']);
    }
}