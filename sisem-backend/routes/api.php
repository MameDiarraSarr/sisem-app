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

// ── Personnel (connexion par email) ──
Route::post('/personnel/connexion', [AuthPersonnelController::class, 'connexion']);

Route::middleware(['auth:sanctum', 'patient'])->group(function () {
    Route::post('/patient/deconnexion', [AuthPatientController::class, 'deconnexion']);
    Route::get('/patient/moi', [AuthPatientController::class, 'moi']);

    Route::get('/patient/resultats', [PatientEspaceController::class, 'mesResultats']);
    Route::get('/patient/resultats/{bulletin}', [PatientEspaceController::class, 'detailResultat']);

    Route::get('/patient/notifications', [PatientEspaceController::class, 'mesNotifications']);
    Route::patch('/patient/notifications/{notification}/lue', [PatientEspaceController::class, 'marquerLue']);
});

// ── Patient (connexion par téléphone) ──
Route::post('/patient/connexion', [AuthPatientController::class, 'connexion']);

Route::middleware(['auth:sanctum', 'patient'])->group(function () {
    Route::post('/patient/deconnexion', [AuthPatientController::class, 'deconnexion']);
    Route::get('/patient/moi', [AuthPatientController::class, 'moi']);
});

// ── Catalogue d'examens (tout le personnel) ──
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::get('/examens', [ExamenController::class, 'index']);
    Route::get('/examens/{examen}', [ExamenController::class, 'show']);
});

// ── Patients ──
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{patient}', [PatientController::class, 'show']);
    Route::post('/patients', [PatientController::class, 'store'])
        ->middleware('role:secretaire,admin');
});

// ── Bulletins d'examen ──
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::get('/bulletins', [BulletinExamenController::class, 'index']);
    Route::get('/bulletins/{bulletin}', [BulletinExamenController::class, 'show']);

    Route::post('/bulletins', [BulletinExamenController::class, 'store'])
        ->middleware('role:secretaire,admin');

    Route::patch('/bulletins/{bulletin}/valider', [BulletinExamenController::class, 'valider'])
        ->middleware('role:biologiste');

    Route::patch('/bulletins/{bulletin}/renvoyer', [BulletinExamenController::class, 'renvoyer'])
        ->middleware('role:biologiste');
});

// ── Saisie des résultats (technicien) ──
Route::middleware(['auth:sanctum', 'personnel', 'role:technicien'])->group(function () {
    Route::post('/bulletins/{bulletin}/resultats', [ResultatController::class, 'saisir']);
});

Route::middleware(['auth:sanctum', 'patient'])->group(function () {
    Route::post('/patient/deconnexion', [AuthPatientController::class, 'deconnexion']);
    Route::get('/patient/moi', [AuthPatientController::class, 'moi']);

    // Espace résultats
    Route::get('/patient/resultats', [PatientEspaceController::class, 'mesResultats']);
    Route::get('/patient/resultats/{bulletin}', [PatientEspaceController::class, 'detailResultat']);
});

// ── Médecins (autocomplétion prescripteur) ──
Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::get('/medecins', [MedecinController::class, 'index']);
});

// ── Gestion du personnel (admin) ──
Route::middleware(['auth:sanctum', 'personnel', 'role:admin'])->group(function () {
    Route::get('/personnel', [PersonnelController::class, 'index']);
    Route::post('/personnel', [PersonnelController::class, 'store']);
    Route::patch('/personnel/{user}/statut', [PersonnelController::class, 'changerStatut']);
});

// ── Affectations (admin et major) ──
Route::middleware(['auth:sanctum', 'personnel', 'role:admin,major'])->group(function () {
    Route::get('/affectations', [AffectationController::class, 'index']);
    Route::post('/affectations', [AffectationController::class, 'store']);
});