<?php

namespace App\Http\Middleware;

use App\Models\Personnel;
use Closure;
use Illuminate\Http\Request;

class VerifieRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (! $user instanceof Personnel || ! in_array($user->role, $roles, true)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $next($request);
    }
}