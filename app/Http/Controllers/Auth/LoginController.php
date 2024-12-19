<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Services\JWTToken;
use App\Http\Services\PasswordService;
use DB;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    //

    public function verifyPassword(Request $request)
    {
        // Misalnya data dari request atau model pengguna
        $namaPemakai = $request->input('username') ?? null; // Input Login
        $password = $request->input('password') ?? null; // Input Password
        $seckey = env('SECKEY'); // Mengambil dari .env file
        //  Raw Query 
        $results = DB::table('loginpemakai_k')
            ->select('nama_pemakai', 'katakunci_pemakai')
            ->where('nama_pemakai', $namaPemakai)
            ->where('loginpemakai_aktif', true)
            ->first();
            $katakunciPemakai =  $results->katakunci_pemakai;

        $passwordService = new PasswordService($namaPemakai);

        $isVerified = $passwordService->cekPassword3($password,$katakunciPemakai, $seckey);

    

        if ($isVerified) {
            $payloadToken =[
                'sub' => $namaPemakai, // Subject
                'role' => 'admin'
            ];
            $token = JWTToken::createToken($payloadToken);
            return response()->json(['message' => 'Password verified', 'token'=>$token], 200);
        }

        return response()->json(['message' => 'Invalid password'], 401);
    }

    public function validateToken(Request $request)
    {
        $token = $request->bearerToken();

        $decoded = JWTToken::validateToken($token);

        if ($decoded && !JWTToken::isExpired($decoded)) {
            return response()->json([
                'message' => 'Token is valid',
                'data' => $decoded
            ]);
        }

        return response()->json([
            'message' => 'Token is invalid or expired'
        ], 401);
    }

    

}
