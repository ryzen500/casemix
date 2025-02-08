<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Services\JWTToken;
use App\Http\Services\PasswordService;
use App\Models\LoginPemakaiK;
use DB;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    //
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $credentials = [
            'nama_pemakai' => $request->input('username'),
            'password' => Hash::make($request->input('password')),
        ];

        $user = LoginPemakaiK::where('nama_pemakai', $request->input('username'))->first();
        if (!$user) {
            return Inertia::render('Auth/Login', [
                'errors' => ['username' => 'Username tidak ditemukan.']
            ]);
        }
        // var_dump($user);die;
        if ($user) {
            // Decrypt the stored password

            $passwordService = new PasswordService($request->input('username'));
            $seckey = env('SECKEY'); // Mengambil dari .env file

            $isVerified = $passwordService->cekPassword3($request->input('password'), $user->katakunci_pemakai, $seckey);


            // Compare the decrypted password with the user input
            // var_dump($isVerified);die;
            if (!$isVerified) {
                return Inertia::render('Auth/Login', [
                    'errors' => ['password' => 'Password salah atau tidak sesuai.']
                ]);
            }
            if ($isVerified) {
                // Log the user in
                Auth::login($user);

                $request->session()->regenerate();

                // return redirect()->intended('/dashboard');
                return redirect()->route('dashboard');
            }
        }

        // return back()->withErrors([
        //     'username' => 'The provided credentials do not match our records.',
        // ]);
    }
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
        $katakunciPemakai = $results->katakunci_pemakai;

        $passwordService = new PasswordService($namaPemakai);

        $isVerified = $passwordService->cekPassword3($password, $katakunciPemakai, $seckey);



        if ($isVerified) {
            $payloadToken = [
                'sub' => $namaPemakai, // Subject
                'role' => 'admin'
            ];
            $token = JWTToken::createToken($payloadToken);
            return response()->json(['message' => 'Password verified', 'token' => $token], 200);
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
