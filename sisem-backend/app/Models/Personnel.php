<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Personnel extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'personnels';

    // Pas d'auto-incrément : l'id vient d'utilisateurs (clé partagée)
    public $incrementing = false;

    protected $fillable = [
        'id', 'matricule', 'role', 'statut', 'pavillon_id',
    ];

    // Attributs communs récupérés depuis utilisateurs (pour $user->prenom, etc.)
    protected $with = ['utilisateur'];

    protected $appends = [
        'prenom', 'nom', 'date_naissance', 'sexe',
        'telephone', 'email', 'adresse', 'mot_de_passe_temporaire',
    ];

    // Lien vers la table mère
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id');
    }

    // Accesseurs : $user->prenom va chercher dans utilisateurs
    public function getPrenomAttribute() { return $this->utilisateur?->prenom; }
    public function getNomAttribute() { return $this->utilisateur?->nom; }
    public function getDateNaissanceAttribute() { return $this->utilisateur?->date_naissance; }
    public function getSexeAttribute() { return $this->utilisateur?->sexe; }
    public function getTelephoneAttribute() { return $this->utilisateur?->telephone; }
    public function getEmailAttribute() { return $this->utilisateur?->email; }
    public function getAdresseAttribute() { return $this->utilisateur?->adresse; }
    public function getMotDePasseTemporaireAttribute() { return $this->utilisateur?->mot_de_passe_temporaire; }

    // Authentification : le mot de passe est dans utilisateurs
    public function getAuthPassword()
    {
        return $this->utilisateur?->mot_de_passe;
    }

    public function pavillon()
    {
        return $this->belongsTo(Pavillon::class);
    }

    public function medecin()
    {
        return $this->hasOne(Medecin::class, 'user_id');
    }

    public function estMedecin(): bool
    {
        return $this->role === 'medecin';
    }
}