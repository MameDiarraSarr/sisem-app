<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'matricule', 'prenom', 'nom', 'date_naissance', 'sexe',
        'telephone', 'email', 'adresse', 'password', 'role', 'statut', 'pavillon_id',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function pavillon()
    {
        return $this->belongsTo(Pavillon::class);
    }

    public function medecin()
    {
        return $this->hasOne(Medecin::class);
    }

    public function estMedecin(): bool
    {
        return $this->role === 'medecin';
    }
}