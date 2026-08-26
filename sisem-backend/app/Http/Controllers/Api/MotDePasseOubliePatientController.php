<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class MotDePasseOubliePatientController extends Controller
{
    // Page frontend où le patient définit son nouveau mot de passe
    private string $lienFront = 'http://localhost:4300/reinitialiser-mot-de-passe';

    // Le patient saisit son téléphone → on lui envoie un lien (email si dispo, sinon WhatsApp)
    public function demander(Request $request)
    {
        $donnees = $request->validate([
            'telephone' => ['required', 'string'],
        ]);

        // Réponse identique que le compte existe ou non (on ne révèle rien)
        $reponse = ['message' => "Si un compte existe pour ce numéro, un lien de réinitialisation vient d'être envoyé."];

        $utilisateur = Utilisateur::where('telephone', $donnees['telephone'])->first();

        // Le compte doit exister ET être un patient
        if (! $utilisateur || ! $utilisateur->patient) {
            return response()->json($reponse);
        }

        // Génère un token, stocke son empreinte, valable 60 min
        $tokenClair = Str::random(64);

        DB::table('password_reset_tokens_patients')->updateOrInsert(
            ['telephone' => $donnees['telephone']],
            [
                'token' => Hash::make($tokenClair),
                'created_at' => now(),
            ]
        );

        $lien = $this->lienFront . '?token=' . $tokenClair . '&telephone=' . urlencode($donnees['telephone']);

        $message = "Bonjour {$utilisateur->prenom},\n\n"
            . "Vous avez demandé la réinitialisation de votre mot de passe SISEM.\n"
            . "Cliquez sur ce lien (valable 60 minutes) :\n"
            . $lien . "\n\n"
            . "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.";

        // Email si le patient en a un, sinon WhatsApp
        if ($utilisateur->email) {
            $this->envoyerParMail($utilisateur->email, $message);
        } else {
            $this->envoyerParWhatsApp($utilisateur->telephone, $message);
        }

        return response()->json($reponse);
    }

    // Le patient définit son nouveau mot de passe
    public function reinitialiser(Request $request)
    {
        $donnees = $request->validate([
            'telephone' => ['required', 'string'],
            'token' => ['required', 'string'],
            'mot_de_passe' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $ligne = DB::table('password_reset_tokens_patients')
            ->where('telephone', $donnees['telephone'])
            ->first();

        if (! $ligne) {
            return response()->json(['message' => 'Lien invalide ou expiré.'], 422);
        }

        // Expiration après 60 minutes
        if (now()->diffInMinutes($ligne->created_at) > 60) {
            DB::table('password_reset_tokens_patients')->where('telephone', $donnees['telephone'])->delete();
            return response()->json(['message' => 'Lien expiré. Veuillez refaire une demande.'], 422);
        }

        if (! Hash::check($donnees['token'], $ligne->token)) {
            return response()->json(['message' => 'Lien invalide ou expiré.'], 422);
        }

        $utilisateur = Utilisateur::where('telephone', $donnees['telephone'])->first();
        if (! $utilisateur) {
            return response()->json(['message' => 'Compte introuvable.'], 422);
        }

        $utilisateur->mot_de_passe = $donnees['mot_de_passe'];
        $utilisateur->mot_de_passe_temporaire = false;
        $utilisateur->save();

        DB::table('password_reset_tokens_patients')->where('telephone', $donnees['telephone'])->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé. Vous pouvez vous connecter.']);
    }

    private function envoyerParMail(string $email, string $message): void
    {
        try {
            Mail::raw($message, function ($m) use ($email) {
                $m->to($email)->subject('SISEM - Réinitialisation de votre mot de passe');
            });
        } catch (\Exception $e) {
            Log::error('Échec envoi mail réinitialisation patient : ' . $e->getMessage());
        }
    }

    private function envoyerParWhatsApp(string $telephone, string $message): void
    {
        try {
            Http::withToken(config('services.whapi.token'))
                ->withoutVerifying()
                ->timeout(10)
                ->post(config('services.whapi.url') . '/messages/text', [
                    'to' => $this->formaterNumero($telephone),
                    'body' => $message,
                ]);
        } catch (\Exception $e) {
            Log::error('Erreur WhatsApp réinitialisation patient : ' . $e->getMessage());
        }
    }

    private function formaterNumero(string $telephone): string
    {
        $numero = preg_replace('/[^0-9]/', '', $telephone);

        if (strlen($numero) === 9 && str_starts_with($numero, '7')) {
            $numero = '221' . $numero;
        }

        return $numero;
    }
}