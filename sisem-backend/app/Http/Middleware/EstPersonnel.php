<?php

namespace App\Http\Middleware;

use App\Models\Personnel;
use Closure;
use Illuminate\Http\Request;

class EstPersonnel
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user() instanceof Personnel) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $next($request);
    }
}