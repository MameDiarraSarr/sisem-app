<?php

namespace App\Services;

use App\Models\BulletinExamen;
use App\Models\Notification;

class NotificationService
{
    // URL de connexion — à adapter au déploiement
    private string $lienConnexion = 'http://localhost:4200/login';

    // Appelé quand un bulletin est validé
    public function notifierResultatsDisponibles(BulletinExamen $bulletin): Notification
    {
        $bulletin->loadMissing('patient', 'medecin.user');
        $patient = $bulletin->patient;

        // ── Le patient : notification en base + envoi externe en arrière-plan ──
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

        // Envoi mail/WhatsApp via la file d'attente — ne bloque pas la validation
        \App\Jobs\EnvoyerNotificationPatient::dispatch($notification->id);

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

        // Toutes les secrétaires débloquées
        $destinataires = $destinataires->merge(
            \App\Models\Personnel::where('role', 'secretaire')->where('statut', 'debloque')->get()
        );

        // Le major du pavillon du bulletin
        if ($bulletin->pavillon_id) {
            $destinataires = $destinataires->merge(
                \App\Models\Personnel::where('role', 'major')
                    ->where('pavillon_id', $bulletin->pavillon_id)
                    ->where('statut', 'debloque')
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
}