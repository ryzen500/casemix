<?php

namespace App\Http\Middleware;

use App\Http\Services\JWTToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JWTAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken(); // Ambil token dari header Authorization

        if (!$token) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        $decoded = JWTToken::validateToken($token);

        if (!$decoded || JWTToken::isExpired($decoded)) {
            return response()->json(['message' => 'Token invalid or expired'], 401);
        }

        // Simpan informasi pengguna ke dalam request (opsional)
        $request->merge(['user' => $decoded]);

        return $next($request); // Lanjutkan ke route berikutnya
    }
}
