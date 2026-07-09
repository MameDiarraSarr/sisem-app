<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyseReference extends Model
{
    protected $fillable = ['examen_id', 'nom_analyse', 'valeur_normale', 'unite'];

    public function examen()
    {
        return $this->belongsTo(Examen::class);
    }

    public function resultats()
    {
        return $this->hasMany(Resultat::class);
    }
}