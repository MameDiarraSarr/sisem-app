<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pavillon;

class PavillonController extends Controller
{
    public function index()
    {
        return response()->json(
            Pavillon::orderBy('nom')->get(['id', 'nom'])
        );
    }
}