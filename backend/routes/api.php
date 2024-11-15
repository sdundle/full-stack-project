<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:api', 'cors'])->group(function () {
    Route::get('/user/profile', [AuthController::class, 'getUser']);
    Route::patch('/user/profile', [AuthController::class, 'updateUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
