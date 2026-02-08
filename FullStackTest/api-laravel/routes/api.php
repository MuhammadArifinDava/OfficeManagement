<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\MeController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('guest.api');

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [MeController::class, 'show']);
    Route::put('/me', [MeController::class, 'update']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/divisions', [DivisionController::class, 'index']);
    Route::get('/divisions/{division}', [DivisionController::class, 'show']);
    Route::post('/divisions', [DivisionController::class, 'store']);
    Route::put('/divisions/{division}', [DivisionController::class, 'update']);
    Route::delete('/divisions/{division}', [DivisionController::class, 'destroy']);

    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::get('/employees/export', [EmployeeController::class, 'export']);
    Route::post('/employees/bulk-delete', [EmployeeController::class, 'bulkDestroy']);
    Route::get('/employees/{employee}', [EmployeeController::class, 'show']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::put('/employees/{employee}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy']);
});

