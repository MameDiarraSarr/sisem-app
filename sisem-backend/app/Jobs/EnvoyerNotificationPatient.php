<?php

namespace App\Jobs;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;

class EnvoyerNotificationPatient implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Le job transporte l'id de la notification à envoyer
    public function __construct(public int $notificationId)
    {
    }

    // Exécuté en arrière-plan par le worker
    public function handle(): void
    {
        $notification = Notification::with('patient')->find($this->notificationId);

        if (! $notification || ! $notification->patient) {
            return;
        }

        $patient = $notification->patient;

        // Email si disponible, sinon WhatsApp
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
            $reponse = Http::withToken(config('services.whapi.token'))
                ->withoutVerifying()
                ->timeout(10)
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

    private function formaterNumero(string $telephone): string
    {
        $numero = preg_replace('/[^0-9]/', '', $telephone);

        if (strlen($numero) === 9 && str_starts_with($numero, '7')) {
            $numero = '221' . $numero;
        }

        return $numero;
    }
}