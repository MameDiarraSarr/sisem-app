<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Patient extends Authenticatable
{
    protected $fillable = [
        'numero_dossier', 'prenom', 'nom', 'date_naissance', 'sexe',
        'telephone', 'email', 'adresse', 'ville', 'mot_de_passe',
        'type_patient', 'pavillon_id',
    ];

    protected $hidden = ['mot_de_passe'];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'mot_de_passe' => 'hashed',
        ];
    }

    // Laravel cherche 'password' par défaut ; on lui indique notre colonne
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    public function pavillon()
    {
        return $this->belongsTo(Pavillon::class);
    }

    public function bulletins()
    {
        return $this->hasMany(BulletinExamen::class);
    }
}