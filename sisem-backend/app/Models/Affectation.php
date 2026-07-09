<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Affectation extends Model
{
    protected $fillable = ['medecin_id', 'pavillon_id', 'date_debut', 'date_fin', 'statut'];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
        ];
    }

    public function medecin()
    {
        return $this->belongsTo(Medecin::class);
    }

    public function pavillon()
    {
        return $this->belongsTo(Pavillon::class);
    }
}