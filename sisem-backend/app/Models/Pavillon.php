<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pavillon extends Model
{
    protected $fillable = ['nom'];

    public function medecins()
    {
        return $this->belongsToMany(Medecin::class, 'affectations');
    }

    public function affectations()
    {
        return $this->hasMany(Affectation::class);
    }

    public function bulletins()
    {
        return $this->hasMany(BulletinExamen::class);
    }

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }
}