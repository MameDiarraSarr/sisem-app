<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medecin;
use Illuminate\Http\Request;

class MedecinController extends Controller
{
    // Liste des médecins, pour l'autocomplétion du prescripteur
    public function index(Request $request)
    {
        $recherche = $request->query('recherche');

        $medecins = Medecin::with(['user', 'pavillons'])
            ->when($recherche, function ($query, $terme) {
                $query->whereHas('user', function ($q) use ($terme) {
                    $q->where('prenom', 'ilike', "%{$terme}%")
                      ->orWhere('nom', 'ilike', "%{$terme}%");
                });
            })
            ->get();

        return response()->json($medecins->map(fn ($m) => [
            'id' => $m->id,
            'nom_complet' => 'Dr. ' . $m->user->prenom . ' ' . $m->user->nom,
            'prenom' => $m->user->prenom,
            'nom' => $m->user->nom,
            'specialite' => $m->specialite,
            // Le pavillon distingue les homonymes — les deux Dr Ndiaye
            'pavillons' => $m->pavillons->pluck('nom'),
        ]));
    }
}