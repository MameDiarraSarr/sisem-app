<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class EstPersonnel
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user() instanceof User) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $next($request);
    }
}