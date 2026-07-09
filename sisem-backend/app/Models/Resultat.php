<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resultat extends Model
{
    protected $fillable = [
        'examen_demande_id', 'analyse_reference_id', 'valeur_resultat', 'date_resultat',
    ];

    protected function casts(): array
    {
        return ['date_resultat' => 'date'];
    }

    public function examenDemande()
    {
        return $this->belongsTo(ExamenDemande::class);
    }

    public function analyseReference()
    {
        return $this->belongsTo(AnalyseReference::class);
    }
}