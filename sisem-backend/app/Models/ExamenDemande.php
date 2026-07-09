<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamenDemande extends Model
{
    protected $fillable = ['bulletin_examen_id', 'examen_id'];

    public function bulletin()
    {
        return $this->belongsTo(BulletinExamen::class, 'bulletin_examen_id');
    }

    public function examen()
    {
        return $this->belongsTo(Examen::class);
    }

    public function resultats()
    {
        return $this->hasMany(Resultat::class);
    }
}