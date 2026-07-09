<?php

use App\Http\Controllers\Api\AuthPatientController;
use App\Http\Controllers\Api\AuthPersonnelController;
use Illuminate\Support\Facades\Route;

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