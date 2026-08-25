<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    // Clé partagée avec personnels : l'id n'est pas auto-généré
    public $incrementing = false;

    protected $fillable = ['id', 'specialite'];

    // Héritage : le médecin EST un personnel (même id)
    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'id');
    }

    // Alias pour ne pas casser le code existant qui appelle ->user
    public function user()
    {
        return $this->belongsTo(Personnel::class, 'id');
    }

    public function pavillons()
    {
        return $this->belongsToMany(Pavillon::class, 'affectations');
    }

    public function affectations()
    {
        return $this->hasMany(Affectation::class);
    }

    public function bulletins()
    {
        return $this->hasMany(BulletinExamen::class);
    }
}