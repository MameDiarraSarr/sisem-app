<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Patient extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'numero_dossier', 'prenom', 'nom', 'date_naissance', 'sexe',
        'telephone', 'email', 'adresse', 'ville', 'mot_de_passe',
        'type_patient', 'mot_de_passe_temporaire',
    ];

    protected $hidden = ['mot_de_passe'];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'mot_de_passe' => 'hashed',
            'mot_de_passe_temporaire' => 'boolean',
        ];
    }

    // Laravel cherche 'password' par défaut ; on lui indique notre colonne
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    public function bulletins()
    {
        return $this->hasMany(BulletinExamen::class);
    }

    public function hospitalisations()
    {
        return $this->hasMany(Hospitalisation::class);
    }

    // Le séjour en cours : celui dont la date de fin n'est pas encore renseignée
    public function hospitalisationActive()
    {
        return $this->hasOne(Hospitalisation::class)->whereNull('date_fin')->latestOfMany();
    }
}