<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    protected $fillable = ['user_id', 'specialite'];

    public function user()
    {
        return $this->belongsTo(Personnel::class);
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