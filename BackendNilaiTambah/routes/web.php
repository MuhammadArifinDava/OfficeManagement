<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NilaiController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/nilaiRT', [NilaiController::class, 'nilaiRT']);
Route::get('/nilaiST', [NilaiController::class, 'nilaiST']);
