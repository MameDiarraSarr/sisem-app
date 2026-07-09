<?php

namespace App\Http\Middleware;

use App\Models\Patient;
use Closure;
use Illuminate\Http\Request;

class EstPatient
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user() instanceof Patient) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $next($request);
    }
}