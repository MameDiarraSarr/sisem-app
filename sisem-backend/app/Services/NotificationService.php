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
    public function notifierResultatsDisponibles(BulletinExamen $bulletin): Notification
    {
        $patient = $bulletin->patient;

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

        return $notification;
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