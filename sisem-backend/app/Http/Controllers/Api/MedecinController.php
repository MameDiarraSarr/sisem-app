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

    // Le major liste les médecins de son pavillon (affectations actives ET inactives, pour pouvoir réintégrer)
    public function medecinsDeMonPavillon(Request $request)
    {
        $major = $request->user();

        $medecins = Medecin::with(['user', 'affectations'])
            ->whereHas('affectations', function ($q) use ($major) {
                $q->where('pavillon_id', $major->pavillon_id);
            })
            ->get();

        return response()->json($medecins->map(function ($m) use ($major) {
            // Le statut de l'affectation DANS le pavillon du major
            $affectation = $m->affectations
                ->where('pavillon_id', $major->pavillon_id)
                ->sortByDesc('id')
                ->first();

            return [
                'id' => $m->id,
                'nom_complet' => 'Dr. ' . $m->user->prenom . ' ' . $m->user->nom,
                'prenom' => $m->user->prenom,
                'nom' => $m->user->nom,
                'specialite' => $m->specialite,
                // Statut de l'AFFECTATION (active/inactive), pas du compte
                'statut_affectation' => $affectation?->statut ?? 'inactive',
            ];
        }));
    }

    public function basculerStatutMedecin(Request $request, Medecin $medecin)
    {
        $major = $request->user();

        $affectation = $medecin->affectations()
            ->where('pavillon_id', $major->pavillon_id)
            ->latest('id')
            ->first();

        if (! $affectation) {
            return response()->json([
                'message' => 'Ce médecin n\'est pas affecté à votre pavillon.',
            ], 403);
        }

        $affectation->update([
            'statut' => $affectation->statut === 'active' ? 'inactive' : 'active',
        ]);

        return response()->json([
            'message' => 'Affectation du médecin mise à jour.',
            'statut' => $affectation->statut,
        ]);
    }
    
}