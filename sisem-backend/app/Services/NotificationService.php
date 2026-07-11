<?php

namespace App\Services;

use App\Models\BulletinExamen;
use App\Models\Notification;

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

        // Tentative d'envoi réel (WhatsApp/SMS) — à brancher plus tard
        $this->envoyer($notification);

        return $notification;
    }

    // ⚠️ Point de branchement unique.
    // Aujourd'hui : ne fait rien de plus (la notification est déjà en base et visible dans l'espace patient).
    // Demain : un appel HTTP à une passerelle WhatsApp/SMS, puis $notification->update(['envoye' => true]).
    private function envoyer(Notification $notification): void
    {
        // TODO déploiement : intégrer la passerelle d'envoi (voir TODO.md)
        //
        // Exemple futur :
        // $reponse = Http::withToken($token)->post('https://passerelle/envoi', [
        //     'to' => $notification->patient->telephone,
        //     'text' => $notification->message . ' ' . $notification->lien,
        // ]);
        // if ($reponse->successful()) {
        //     $notification->update(['envoye' => true]);
        // }
    }
}