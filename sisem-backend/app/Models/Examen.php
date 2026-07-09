<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Examen extends Model
{
    protected $fillable = ['nom_examen'];

    public function analyses()
    {
        return $this->hasMany(AnalyseReference::class);
    }

    public function examenDemandes()
    {
        return $this->hasMany(ExamenDemande::class);
    }
}