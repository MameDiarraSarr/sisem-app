<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'patient_id', 'bulletin_examen_id', 'message', 'lien', 'lu', 'envoye',
    ];

    protected function casts(): array
    {
        return ['lu' => 'boolean', 'envoye' => 'boolean'];
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