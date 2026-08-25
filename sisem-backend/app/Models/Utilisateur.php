<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Utilisateur extends Authenticatable
{
    protected $table = 'utilisateurs';

    protected $fillable = [
        'prenom', 'nom', 'date_naissance', 'sexe',
        'telephone', 'email', 'adresse', 'mot_de_passe', 'mot_de_passe_temporaire',
    ];

    protected $hidden = ['mot_de_passe', 'remember_token'];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'email_verified_at' => 'datetime',
            'mot_de_passe' => 'hashed',
            'mot_de_passe_temporaire' => 'boolean',
        ];
    }

    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    // Le personnel lié à cet utilisateur (s'il en est un)
    public function personnel()
    {
        return $this->hasOne(Personnel::class, 'id');
    }

    // Le patient lié à cet utilisateur (s'il en est un)
    public function patient()
    {
        return $this->hasOne(Patient::class, 'id');
    }
}