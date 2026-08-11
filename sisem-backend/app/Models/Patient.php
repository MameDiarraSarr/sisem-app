<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Patient extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'patients';

    // Pas d'auto-incrément : l'id vient d'utilisateurs (clé partagée)
    public $incrementing = false;

    protected $fillable = [
        'id', 'numero_dossier', 'type_patient', 'ville', 'pavillon_id',
    ];

    protected $with = ['utilisateur'];

    protected $appends = [
        'prenom', 'nom', 'date_naissance', 'sexe',
        'telephone', 'email', 'adresse', 'mot_de_passe_temporaire',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id');
    }

    public function getPrenomAttribute() { return $this->utilisateur?->prenom; }
    public function getNomAttribute() { return $this->utilisateur?->nom; }
    public function getDateNaissanceAttribute() { return $this->utilisateur?->date_naissance; }
    public function getSexeAttribute() { return $this->utilisateur?->sexe; }
    public function getTelephoneAttribute() { return $this->utilisateur?->telephone; }
    public function getEmailAttribute() { return $this->utilisateur?->email; }
    public function getAdresseAttribute() { return $this->utilisateur?->adresse; }
    public function getMotDePasseTemporaireAttribute() { return $this->utilisateur?->mot_de_passe_temporaire; }

    public function getAuthPassword()
    {
        return $this->utilisateur?->mot_de_passe;
    }

    public function bulletins()
    {
        return $this->hasMany(BulletinExamen::class);
    }

    // Le pavillon du patient (direct, comme dans le diagramme simplifié)
    public function pavillon()
    {
        return $this->belongsTo(Pavillon::class);
    }
}