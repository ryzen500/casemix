<?php

namespace App\Http\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTToken
{
    private static $secretKey;

    public static function initialize()
    {
        self::$secretKey = env('JWT_SECRET');
    }

    public static function createToken($payload, $expiryInSeconds = 3600)
    {
        self::initialize();
        $payload['iat'] = time(); // Issued at
        $payload['exp'] = time() + $expiryInSeconds; // Expiry time

        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    public static function validateToken($token)
    {
        self::initialize();
        try {
            $decoded = JWT::decode($token, new Key(self::$secretKey, 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            return false; // Token tidak valid
        }
    }

    public static function isExpired($decodedToken)
    {
        return isset($decodedToken['exp']) && time() > $decodedToken['exp'];
    }
}
