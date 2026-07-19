<?php

namespace App\Services;

use App\Models\BulletinExamen;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;

class NotificationService
{
    // URL de connexion — à adapter au déploiement
    private string $lienConnexion = 'http://localhost:4201/connexion';

    // Appelé quand un bulletin est validé
    // Appelé quand un bulletin est validé
    public function notifierResultatsDisponibles(BulletinExamen $bulletin): Notification
    {
        $bulletin->loadMissing('patient', 'medecin.user');
        $patient = $bulletin->patient;

        // ── Le patient : notification + envoi externe (mail ou WhatsApp) ──
        $notification = Notification::create([
            'patient_id' => $patient->id,
            'bulletin_examen_id' => $bulletin->id,
            'message' => "Bonjour {$patient->prenom}, vos résultats du "
                . $bulletin->date_enregistrement->format('d/m/Y')
                . " sont disponibles sur SISEM.",
            'lien' => $this->lienConnexion,
            'lu' => false,
            'envoye' => false,
        ]);

        $this->envoyer($notification);

        // ── Le personnel : cloche dans l'application, sans envoi externe ──
        $this->notifierPersonnel($bulletin, $patient);

        return $notification;
    }

    // Notifie secrétaires, major du pavillon et médecin prescripteur (cloche uniquement)
    private function notifierPersonnel(BulletinExamen $bulletin, $patient): void
    {
        $message = "Les résultats du bulletin {$bulletin->numero_labo} "
            . "({$patient->prenom} {$patient->nom}) ont été validés.";

        $destinataires = collect();

        // Toutes les secrétaires actives
        $destinataires = $destinataires->merge(
            \App\Models\User::where('role', 'secretaire')->where('statut', 'actif')->get()
        );

        // Le major du pavillon du bulletin
        if ($bulletin->pavillon_id) {
            $destinataires = $destinataires->merge(
                \App\Models\User::where('role', 'major')
                    ->where('pavillon_id', $bulletin->pavillon_id)
                    ->where('statut', 'actif')
                    ->get()
            );
        }

        // Le médecin prescripteur
        if ($bulletin->medecin && $bulletin->medecin->user) {
            $destinataires->push($bulletin->medecin->user);
        }

        // Une notification par destinataire, sans doublon
        foreach ($destinataires->unique('id') as $membre) {
            Notification::create([
                'user_id' => $membre->id,
                'bulletin_examen_id' => $bulletin->id,
                'message' => $message,
                'lien' => null,
                'lu' => false,
                'envoye' => false,
            ]);
        }
    }

    // Choix du canal : email si disponible, sinon WhatsApp
    private function envoyer(Notification $notification): void
    {
        $patient = $notification->patient;

        if ($patient->email) {
            $this->envoyerParMail($notification, $patient);
        } else {
            $this->envoyerParWhatsApp($notification, $patient);
        }
    }

    private function envoyerParMail(Notification $notification, $patient): void
    {
        try {
            Mail::raw(
                $notification->message . "\n\nConsultez vos résultats : " . $notification->lien,
                function ($m) use ($patient) {
                    $m->to($patient->email)
                      ->subject('SISEM - Vos résultats sont disponibles');
                }
            );
            $notification->update(['envoye' => true]);
        } catch (\Exception $e) {
            Log::error('Échec envoi mail notification : ' . $e->getMessage());
        }
    }

    private function envoyerParWhatsApp(Notification $notification, $patient): void
    {
        try {
            // withoutVerifying() : contourne la vérification SSL en dev local (WAMP).
            // ⚠️ À retirer au déploiement, en configurant cacert.pem dans php.ini.
            $reponse = Http::withToken(config('services.whapi.token'))
                ->withoutVerifying()
                ->post(config('services.whapi.url') . '/messages/text', [
                    'to' => $this->formaterNumero($patient->telephone),
                    'body' => $notification->message . "\n\n" . $notification->lien,
                ]);

            if ($reponse->successful()) {
                $notification->update(['envoye' => true]);
            } else {
                Log::error('Échec envoi WhatsApp : ' . $reponse->body());
            }
        } catch (\Exception $e) {
            Log::error('Erreur WhatsApp : ' . $e->getMessage());
        }
    }

    // WhatsApp attend le format international sans + ni espaces (ex: 221771234567)
    private function formaterNumero(string $telephone): string
    {
        $numero = preg_replace('/[^0-9]/', '', $telephone);

        // Numéro sénégalais local (9 chiffres commençant par 7) → préfixe 221
        if (strlen($numero) === 9 && str_starts_with($numero, '7')) {
            $numero = '221' . $numero;
        }

        return $numero;
    }
}