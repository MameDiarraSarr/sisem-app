<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'patient_id', 'bulletin_examen_id', 'message', 'lien', 'lu', 'envoye',
    ];

    protected $appends = ['statut'];

    protected function casts(): array
    {
        return ['lu' => 'boolean', 'envoye' => 'boolean'];
    }

    public function getStatutAttribute(): string
    {
        if (!$this->envoye) {
            return 'en_attente';
        }
        return $this->lu ? 'lue' : 'non_lue';
    }

    public function user()
    {
        return $this->belongsTo(Personnel::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function bulletin()
    {
        return $this->belongsTo(BulletinExamen::class, 'bulletin_examen_id');
    }
}