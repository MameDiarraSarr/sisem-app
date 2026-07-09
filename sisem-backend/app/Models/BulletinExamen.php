<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulletinExamen extends Model
{
    protected $fillable = [
        'numero_labo', 'patient_id', 'pavillon_id', 'medecin_id',
        'indication_examen', 'traitement_en_cours', 'date_enregistrement', 'statut',
    ];

    protected function casts(): array
    {
        return ['date_enregistrement' => 'date'];
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function pavillon()
    {
        return $this->belongsTo(Pavillon::class);
    }

    public function medecin()
    {
        return $this->belongsTo(Medecin::class);
    }

    public function examenDemandes()
    {
        return $this->hasMany(ExamenDemande::class);
    }

    // Tous les résultats du bulletin, à travers ses examens demandés
    public function resultats()
    {
        return $this->hasManyThrough(Resultat::class, ExamenDemande::class);
    }
}