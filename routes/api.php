<?php

use App\Http\Controllers\BPJS\Monitoring\MonitoringBPJSController;
use App\Http\Controllers\BPJS\SearchPeserta\SearchPesertaBPJSController;
use App\Http\Controllers\Casemix\InAcbgGrouperController;
use App\Http\Controllers\Casemix\SearchDiagnosaController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Casemix\SearchProceduralController;
use App\Http\Controllers\Laporan\laporanBukuRegisterController;
use App\Http\Controllers\Laporan\LaporandetailPasienpulangController;
use App\Http\Controllers\Laporan\LaporanSEPController;
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
Route::group(['prefix' => 'inacbg', 'middleware' => 'auth.jwt'], function () {
    // Get


    // Get
    Route::get('grouper', [InAcbgGrouperController::class, 'index'])->name('inacbg.grouper.index');

    // POST
    Route::post('newClaim', [InAcbgGrouperController::class, 'saveNewKlaim'])->name('inacbg.grouper.newClaim');
    Route::post('updateNewKlaim', [InAcbgGrouperController::class, 'updateNewKlaim'])->name('updateNewKlaim');
    Route::post('groupingStageSatu', [InAcbgGrouperController::class, 'groupingStageSatu'])->name('groupingStageSatu');
    Route::post('Finalisasi', [InAcbgGrouperController::class, 'Finalisasi'])->name('Finalisasi');
    Route::post('editUlangKlaim', [InAcbgGrouperController::class, 'EditUlangKlaim'])->name('editUlangKlaim');
    Route::post('deleteKlaim', [InAcbgGrouperController::class, 'deleteKlaim'])->name('deleteKlaim');

});


/**
 * Authentication
 */
Route::post('loginPassword', [LoginController::class, 'verifyPassword'])->name('verifyPassword');


/**
 * Core 
 */

Route::group(['prefix' => 'feature', 'middleware' => 'auth.jwt'], function () {
    //POST 
    Route::post('searchDiagnosa', [SearchDiagnosaController::class, 'index'])->name('searchDiagnosa');
    Route::post('searchProcedural', [SearchProceduralController::class, 'index'])->name('searchProcedural');
    Route::post('searchPesertaBPJS', [SearchPesertaBPJSController::class, 'index'])->name('searchPesertaBPJS');
    Route::post('getSearchGroupper', [InAcbgGrouperController::class, 'getSearchGroupper'])->name('getSearchGroupper');
    Route::post('deleteKlaim', [InAcbgGrouperController::class, 'deleteKlaim'])->name('deleteKlaim');

    Route::post('updateNewKlaim', [InAcbgGrouperController::class, 'updateNewKlaim'])->name('updateNewKlaim');
    Route::post('groupingStageSatu', [InAcbgGrouperController::class, 'groupingStageSatu'])->name('groupingStageSatu');
    Route::post('Finalisasi', [InAcbgGrouperController::class, 'Finalisasi'])->name('Finalisasi');
    Route::post('printKlaim', [InAcbgGrouperController::class, 'printKlaim'])->name('printKlaim');

});

/**
 * 
 * Routes Grouping for monitoring
 */

 Route::group(['prefix' => 'reporting', 'middleware' => 'auth.jwt'], function () {
    //POST 
    Route::post('DetailPasienPulang', [LaporandetailPasienpulangController::class, 'index'])->name('DetailPasienPulang');
    Route::post('BukuRegister', [laporanBukuRegisterController::class, 'getData'])->name('BukuRegister');
    Route::post('LaporanKlaimPiutang', [InAcbgGrouperController::class, 'listReportClaim'])->name('LaporanKlaimPiutang');
    Route::get('getData', [LaporanSEPController::class, 'getData'])->name('getData');

});



Route::group(['prefix' => 'monitoring', 'middleware' => 'auth.jwt'], function () {
    //POST monitoring kunjungan 
    Route::post('searchMonitoringKunjungan', [MonitoringBPJSController::class, 'index'])->name('searchMonitoringKunjungan');
    //Monitoring Klaim 
    Route::post('searchMonitoringKlaim', [MonitoringBPJSController::class, 'listDataKlaim'])->name('searchMonitoringKlaim');
    //Monitoring riwayat 
    Route::post('searchRiwayatKlaim', [MonitoringBPJSController::class, 'listDataRiwayat'])->name('searchRiwayatKlaim');
});
