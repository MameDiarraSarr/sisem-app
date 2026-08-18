<?php

use App\Http\Controllers\Api\AuthPatientController;
use App\Http\Controllers\Api\AuthPersonnelController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ExamenController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\BulletinExamenController;
use App\Http\Controllers\Api\ResultatController;
use App\Http\Controllers\Api\PatientEspaceController;
use App\Http\Controllers\Api\MedecinController;
use App\Http\Controllers\Api\AffectationController;
use App\Http\Controllers\Api\PersonnelController;
use App\Http\Controllers\Api\MotDePasseController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\PavillonController;


Route::post('/personnel/connexion', [AuthPersonnelController::class, 'connexion']);
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::post('/personnel/deconnexion', [AuthPersonnelController::class, 'deconnexion']);
    Route::get('/personnel/moi', [AuthPersonnelController::class, 'moi']);
    Route::post('/personnel/changer-mot-de-passe', [MotDePasseController::class, 'changer']);
    Route::get('/personnel/profil', [ProfilController::class, 'afficher']);
    Route::put('/personnel/profil', [ProfilController::class, 'modifier']);
});
Route::post('/patient/connexion', [AuthPatientController::class, 'connexion']);
Route::middleware(['auth:sanctum', 'patient'])->group(function () {
    Route::post('/patient/deconnexion', [AuthPatientController::class, 'deconnexion']);
    Route::get('/patient/moi', [AuthPatientController::class, 'moi']);
    Route::post('/patient/changer-mot-de-passe', [MotDePasseController::class, 'changer']);
    Route::get('/patient/profil', [ProfilController::class, 'afficher']);
    Route::put('/patient/profil', [ProfilController::class, 'modifier']);
    Route::get('/patient/resultats', [PatientEspaceController::class, 'mesResultats']);
    Route::get('/patient/resultats/{bulletin}', [PatientEspaceController::class, 'detailResultat']);
    Route::get('/patient/notifications', [PatientEspaceController::class, 'mesNotifications']);
    Route::patch('/patient/notifications/{notification}/lue', [PatientEspaceController::class, 'marquerLue']);
});
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::get('/examens', [ExamenController::class, 'index']);
    Route::get('/examens/{examen}', [ExamenController::class, 'show']);
    Route::get('/pavillons', [PavillonController::class, 'index']);
});

// ── Patients ──
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{patient}', [PatientController::class, 'show']);
    Route::post('/patients', [PatientController::class, 'store'])
        ->middleware('role:secretaire,admin');
    Route::put('/patients/{patient}', [PatientController::class, 'update'])
        ->middleware('role:secretaire,admin');
});

// ── Bulletins d'examen ──
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::get('/bulletins', [BulletinExamenController::class, 'index']);
    Route::get('/bulletins/nombre-a-traiter', [BulletinExamenController::class, 'nombreATraiter']);
    Route::get('/bulletins/{bulletin}', [BulletinExamenController::class, 'show']);

    Route::post('/bulletins', [BulletinExamenController::class, 'store'])
        ->middleware('role:secretaire,admin');

    Route::patch('/bulletins/{bulletin}/valider', [BulletinExamenController::class, 'valider'])
        ->middleware('role:biologiste');

    Route::patch('/bulletins/{bulletin}/renvoyer', [BulletinExamenController::class, 'renvoyer'])
        ->middleware('role:biologiste');

    Route::patch('/bulletins/{bulletin}/imprimer', [BulletinExamenController::class, 'marquerImprime'])
        ->middleware('role:secretaire,admin');
});

// ── Saisie des résultats (technicien) ──
Route::middleware(['auth:sanctum', 'personnel', 'role:technicien'])->group(function () {
    Route::post('/bulletins/{bulletin}/resultats', [ResultatController::class, 'saisir']);
});

// ── Médecins (autocomplétion prescripteur) ──
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::get('/medecins', [MedecinController::class, 'index']);
});

// ── Major : médecins de son pavillon ──
Route::middleware(['auth:sanctum', 'personnel', 'role:major'])->group(function () {
    Route::get('/major/medecins', [MedecinController::class, 'medecinsDeMonPavillon']);
    Route::patch('/major/medecins/{medecin}/statut', [MedecinController::class, 'basculerStatutMedecin']);
});

// ── Gestion du personnel (admin) ──
Route::middleware(['auth:sanctum', 'personnel', 'role:admin'])->group(function () {
    Route::get('/personnel', [PersonnelController::class, 'index']);
    Route::post('/personnel', [PersonnelController::class, 'store']);
    Route::patch('/personnel/{user}/statut', [PersonnelController::class, 'changerStatut']);
    Route::get('/personnel/{user}', [PersonnelController::class, 'show']);
    Route::put('/personnel/{user}', [PersonnelController::class, 'update']);
});

// ── Affectations (admin et major) ──
Route::middleware(['auth:sanctum', 'personnel', 'role:admin,major'])->group(function () {
    Route::get('/affectations', [AffectationController::class, 'index']);
    Route::post('/affectations', [AffectationController::class, 'store']);
    Route::patch('/affectations/{affectation}/retirer', [AffectationController::class, 'retirer']);
});