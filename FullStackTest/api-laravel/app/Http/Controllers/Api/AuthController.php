<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $payload = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $token = Auth::guard('api')->attempt([
            'username' => $payload['username'],
            'password' => $payload['password'],
        ]);

        if (! $token) {
            return ApiResponse::error('Username atau password salah', 401);
        }

        $admin = Auth::guard('api')->user();

        return ApiResponse::success('Login berhasil', [
            'token' => $token,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'username' => $admin->username,
                'phone' => $admin->phone,
                'email' => $admin->email,
            ],
        ]);
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return ApiResponse::success('Logout berhasil');
    }
}

