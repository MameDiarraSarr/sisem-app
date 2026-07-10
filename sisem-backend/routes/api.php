<?php

use App\Http\Controllers\Api\AuthPatientController;
use App\Http\Controllers\Api\AuthPersonnelController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ExamenController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\BulletinExamenController;
use App\Http\Controllers\Api\ResultatController;
use App\Http\Controllers\Api\PatientEspaceController;

// ── Personnel (connexion par email) ──
Route::post('/personnel/connexion', [AuthPersonnelController::class, 'connexion']);

Route::middleware(['auth:sanctum', 'personnel'])->group(function () {
    Route::post('/personnel/deconnexion', [AuthPersonnelController::class, 'deconnexion']);
    Route::get('/personnel/moi', [AuthPersonnelController::class, 'moi']);
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