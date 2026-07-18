<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
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

        $utilisateur = $request->user();

        // Le personnel utilise 'password', le patient 'mot_de_passe'
        $estPatient = $utilisateur instanceof Patient;
        $motDePasseActuel = $estPatient ? $utilisateur->mot_de_passe : $utilisateur->password;

        if (! Hash::check($donnees['ancien_mot_de_passe'], $motDePasseActuel)) {
            throw ValidationException::withMessages([
                'ancien_mot_de_passe' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        if ($estPatient) {
            $utilisateur->mot_de_passe = $donnees['nouveau_mot_de_passe'];
        } else {
            $utilisateur->password = $donnees['nouveau_mot_de_passe'];
        }

        $utilisateur->mot_de_passe_temporaire = false;
        $utilisateur->save();

        return response()->json(['message' => 'Mot de passe modifié.']);
    }
}