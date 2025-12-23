<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CulinaryController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API ROUTES - KULINER NUSANTARA
|--------------------------------------------------------------------------
*/

/* --- 1. PUBLIC ROUTES (Tanpa Login) --- */

// Autentikasi
Route::post('/register/visitor', [AuthController::class, 'registerVisitor']);
Route::post('/register/umkm', [AuthController::class, 'registerUmkm']);
Route::post('/login', [AuthController::class, 'login']);

// Data Kuliner & Review
Route::get('/culinaries', [CulinaryController::class, 'index']);
Route::get('/culinaries/{id}', [CulinaryController::class, 'show']);
Route::get('/reviews/{culinary_id}', [ReviewController::class, 'index']);


/* --- 2. PROTECTED ROUTES (Wajib Bawa Token/Login) --- */

Route::middleware('auth:sanctum')->group(function () {
    
    // Cek Profile & Logout
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Fitur UMKM (Manage Dagangan Sendiri)
    Route::get('/my-culinaries', [CulinaryController::class, 'myCulinaries']);
    Route::post('/culinaries', [CulinaryController::class, 'store']);
    Route::delete('/culinaries/{id}', [CulinaryController::class, 'destroy']);

    // Fitur Review (Visitor Kirim Ulasan)
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Fitur Admin (Kendali Penuh)
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
    Route::get('/admin/pending-umkm', [AuthController::class, 'getPendingUmkm']);
    Route::post('/admin/verify-umkm/{id}', [AuthController::class, 'verifyUmkm']);
    Route::get('/admin/culinaries', [CulinaryController::class, 'adminIndex']);
    Route::get('/admin/reviews', [ReviewController::class, 'adminIndex']);
    Route::post('/admin/reviews/{id}/status', [ReviewController::class, 'updateStatus']);

});