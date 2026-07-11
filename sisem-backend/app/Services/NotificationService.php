<?php

namespace App\Services;

use App\Models\BulletinExamen;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

    // ⚠️ À brancher quand la passerelle WhatsApp sera prête (Whapi/Wasender)
    private function envoyerParWhatsApp(Notification $notification, $patient): void
    {
        // TODO : appel HTTP à la passerelle WhatsApp
        // $reponse = Http::withToken($token)->post('https://gate.whapi.cloud/messages/text', [
        //     'to' => $patient->telephone,
        //     'body' => $notification->message . ' ' . $notification->lien,
        // ]);
        // if ($reponse->successful()) $notification->update(['envoye' => true]);
    }
}