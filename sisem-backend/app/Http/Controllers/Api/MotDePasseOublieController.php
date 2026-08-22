<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class MotDePasseOublieController extends Controller
{
    // URL du frontend où l'utilisateur choisira son nouveau mot de passe
    private string $lienFront = 'http://localhost:4200/reinitialiser-mot-de-passe';

    // Étape 1 : l'utilisateur saisit son e-mail, on lui envoie un lien de réinitialisation
    public function demander(Request $request)
    {
        $donnees = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $utilisateur = Utilisateur::where('email', $donnees['email'])->first();

        // Message identique que l'e-mail existe ou non (on n'indique pas si un compte existe)
        $reponse = ['message' => "Si un compte existe pour cet e-mail, un lien de réinitialisation vient d'être envoyé."];

        if (! $utilisateur) {
            return response()->json($reponse);
        }

        // On génère un token, on le stocke haché, et on garde la version en clair pour le lien
        $tokenClair = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $donnees['email']],
            [
                'token' => Hash::make($tokenClair),
                'created_at' => now(),
            ]
        );

        // Le lien contient le token en clair + l'e-mail
        $lien = $this->lienFront . '?token=' . $tokenClair . '&email=' . urlencode($donnees['email']);

        // Envoi d'un mail simple en texte
        Mail::raw(
            "Bonjour {$utilisateur->prenom},\n\n"
            . "Vous avez demandé la réinitialisation de votre mot de passe SISEM.\n"
            . "Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :\n\n"
            . $lien . "\n\n"
            . "Ce lien est valable 60 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.\n\n"
            . "L'équipe SISEM",
            function ($message) use ($utilisateur) {
                $message->to($utilisateur->email)
                        ->subject('SISEM - Réinitialisation de votre mot de passe');
            }
        );

        return response()->json($reponse);
    }

    // Étape 2 : l'utilisateur clique sur le lien, saisit un nouveau mot de passe
    public function reinitialiser(Request $request)
    {
        $donnees = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'mot_de_passe' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $ligne = DB::table('password_reset_tokens')
            ->where('email', $donnees['email'])
            ->first();

        // Pas de demande en cours pour cet e-mail
        if (! $ligne) {
            return response()->json(['message' => "Lien invalide ou expiré."], 422);
        }

        // Le lien expire au bout de 60 minutes
        if (now()->diffInMinutes($ligne->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $donnees['email'])->delete();
            return response()->json(['message' => "Ce lien a expiré. Veuillez refaire une demande."], 422);
        }

        // Le token fourni doit correspondre au token haché stocké
        if (! Hash::check($donnees['token'], $ligne->token)) {
            return response()->json(['message' => "Lien invalide ou expiré."], 422);
        }

        $utilisateur = Utilisateur::where('email', $donnees['email'])->first();
        if (! $utilisateur) {
            return response()->json(['message' => "Compte introuvable."], 422);
        }

        // On change le mot de passe (le cast 'hashed' du modèle le hache tout seul)
        $utilisateur->mot_de_passe = $donnees['mot_de_passe'];
        $utilisateur->mot_de_passe_temporaire = false;
        $utilisateur->save();

        // On supprime le token : il ne doit servir qu'une fois
        DB::table('password_reset_tokens')->where('email', $donnees['email'])->delete();

        return response()->json(['message' => "Votre mot de passe a été réinitialisé. Vous pouvez vous connecter."]);
    }
}