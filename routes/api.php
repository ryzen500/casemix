<?php

use App\Http\Controllers\Casemix\InAcbgGrouperController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


/**
 * Listing Untuk Casemix API
 */
Route::prefix('inacbg')->group(function () {

    // Get
    Route::get('grouper', [InAcbgGrouperController::class,'index'])->name('inacbg.grouper.index');

    // POST
    Route::post('grouper', [InAcbgGrouperController::class,'saveNewKlaim'])->name('inacbg.grouper.newClaim');

});
