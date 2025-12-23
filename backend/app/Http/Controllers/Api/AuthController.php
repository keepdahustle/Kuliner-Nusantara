<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Registrasi untuk PENGGUNA UMUM (MEMBER)
     * Role di Database: visitor
     */
    public function registerVisitor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'visitor', // <--- INI ROLENYA DI DATABASE
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi Member berhasil!',
            'token' => $token,
            'role' => $user->role,
            'user' => $user
        ], 201);
    }

    /**
     * Registrasi Khusus MITRA UMKM
     */
    public function registerUmkm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'nama_usaha' => 'required|string|max:255',
            'nik_ktp' => 'required|string|size:16',
            'npwp' => 'nullable|string',
            'kategori_usaha' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'umkm',
            'nama_usaha' => $request->nama_usaha,
            'nik_ktp' => $request->nik_ktp,
            'npwp' => $request->npwp,
            'kategori_usaha' => $request->kategori_usaha,
            'is_verified' => false // Menunggu Admin
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran Mitra berhasil. Tunggu verifikasi admin.',
            'data' => $user
        ], 201);
    }

    /**
     * Login Utama (Handled for all roles)
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Email atau Password salah.'], 401);
        }

        // Jika UMKM belum diverifikasi, dilarang masuk
        if ($user->role === 'umkm' && !$user->is_verified) {
            return response()->json(['success' => false, 'message' => 'Akun Mitra sedang diverifikasi Admin.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'role' => $user->role,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ], 200);
    }

    public function getPendingUmkm() {
        return response()->json(['success' => true, 'data' => User::where('role', 'umkm')->where('is_verified', false)->get()]);
    }

    public function verifyUmkm(Request $request, $id) {
        $user = User::findOrFail($id);
        $user->is_verified = $request->status === 'approve';
        $user->save();
        return response()->json(['success' => true]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true]);
    }
}