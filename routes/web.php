<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Casemix\InAcbgGrouperController;
use App\Http\Controllers\Casemix\SearchDiagnosaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Laporan\laporanBukuRegisterController;
use App\Http\Controllers\Laporan\LaporanKlaimController;
use App\Http\Controllers\Laporan\LaporanSEPController;
use App\Http\Controllers\Pasienicd9\Pasienicd9cmTController;
use App\Http\Controllers\PasienmorbiditasT\PasienmorbiditasTController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     // return Inertia::render('Welcome', [
//     //     'canLogin' => Route::has('login'),
//     //     'canRegister' => Route::has('register'),
//     //     'laravelVersion' => Application::VERSION,
//     //     'phpVersion' => PHP_VERSION,
//     // ]);
// });
Route::get('/', [AuthenticatedSessionController::class, 'create'])
->name('login');

// Route::get('login', [AuthenticatedSessionController::class, 'create'])
// ->name('login');

Route::get('login', function () {
    return Inertia::render('Auth/Login');
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth'])->name('dashboard');


// Route::get('login', [AuthenticatedSessionController::class, 'create'])
// ->name('login');
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', action: [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // laporan
    Route::get('/laporanSEP', action: [LaporanSEPController::class, 'index'])->name('laporanSEP');
    Route::get('/getLaporanSEP', action: [LaporanSEPController::class, 'getData'])->name('getLaporanSEP');

    // Laporan Klaim
    Route::get('/laporanKlaim', action: [LaporanKlaimController::class, 'index'])->name('laporanKlaim');
    Route::get('/getLaporanKlaim', action: [LaporanKlaimController::class, 'getData'])->name('getLaporanKlaim');


    //Laporan Buku Register 
    Route::get('/laporanBukuRegister', action: [laporanBukuRegisterController::class, 'index'])->name('laporanBukuRegister');
    Route::get('/getLaporanBukuRegister', action: [laporanBukuRegisterController::class, 'getData'])->name('getLaporanBukuRegister');

    // transaksi
    Route::post('newClaim', [InAcbgGrouperController::class, 'saveNewKlaim'])->name('newClaim');
    Route::post('updateNewKlaim', [InAcbgGrouperController::class, 'updateNewKlaim'])->name('updateNewKlaim');
    Route::get('searchGroupper', [InAcbgGrouperController::class, 'searchGroupper'])->name('searchGroupper');
    Route::post('getSearchGroupper', [InAcbgGrouperController::class, 'getSearchGroupper'])->name('getSearchGroupper');
    Route::post('getSearchGroupperData', [InAcbgGrouperController::class, 'getSearchGroupperData'])->name('getSearchGroupperData');
    Route::get('searchGroupperPasien/{id}', [InAcbgGrouperController::class, 'searchGroupperPasien'])->name('searchGroupperPasien');
    Route::post('getGroupperPasien/', [InAcbgGrouperController::class, 'getGroupperPasien'])->name('getGroupperPasien');
    Route::post('groupingStageSatu', [InAcbgGrouperController::class, 'groupingStageSatu'])->name('groupingStageSatu');
    Route::post('Finalisasi', [InAcbgGrouperController::class, 'Finalisasi'])->name('Finalisasi');
    Route::post('editUlangKlaim', [InAcbgGrouperController::class, 'EditUlangKlaim'])->name('editUlangKlaim');
    Route::post('kirimIndividualKlaim', [InAcbgGrouperController::class, 'kirimIndividualKlaim'])->name('kirimIndividualKlaim');

    Route::post('printKlaim', [InAcbgGrouperController::class, 'printKlaim'])->name('printKlaim');
    Route::post('deleteKlaim', [InAcbgGrouperController::class, 'deleteKlaim'])->name('deleteKlaim');
    Route::post('validateSITB', [InAcbgGrouperController::class, 'validateSITB'])->name('validateSITB');

    Route::post('sinkronSep', [InAcbgGrouperController::class, 'sinkronSep'])->name('sinkronSep');
    Route::post('submitSinkron', [InAcbgGrouperController::class, 'submitSinkron'])->name('submitSinkron');
    // kirim data online
    Route::get('kirimDataOnline', [InAcbgGrouperController::class, 'kirimDataOnline'])->name('kirimDataOnline');
    Route::post('kirimDataOnlineSearch', [InAcbgGrouperController::class, 'kirimDataOnlineSearch'])->name('kirimDataOnlineSearch');
    Route::post('kirimDataOnlineKolektif', [InAcbgGrouperController::class, 'kirimDataOnlineKolektif'])->name('kirimDataOnlineKolektif');

    
    // autocomplete
    Route::post('searchDiagnosa', [SearchDiagnosaController::class, 'autocompleteDiagnosa'])->name('searchDiagnosa');
    Route::post('searchDiagnosaCode', [SearchDiagnosaController::class, 'autocompleteDiagnosa'])->name('searchDiagnosaCode');
    Route::post('searchDiagnosaIX', [SearchDiagnosaController::class, 'autocompleteDiagnosaIX'])->name('searchDiagnosaIX');
    Route::post('searchDiagnosaCodeIX', [SearchDiagnosaController::class, 'autocompleteDiagnosaIXCode'])->name('searchDiagnosaCodeIX');

    // pasienmorbiditasT
    Route::post('insertMorbiditasT', [PasienmorbiditasTController::class, 'insertMorbiditasT'])->name('insertMorbiditasT');
    Route::post('removeMorbiditasT', [PasienmorbiditasTController::class, 'removeMorbiditasT'])->name('removeMorbiditasT');
    Route::post('updateMorbiditasT', [PasienmorbiditasTController::class, 'updateMorbiditasT'])->name('updateMorbiditasT');

    // pasienicd9cmT
    Route::post('insertPasienicd9T', [Pasienicd9cmTController::class, 'insertPasienicd9T'])->name('insertPasienicd9T');
    Route::post('removePasienicd9T', [Pasienicd9cmTController::class, 'removePasienicd9T'])->name('removePasienicd9T');
    Route::post('updatePasienicd9T', [Pasienicd9cmTController::class, 'updatePasienicd9T'])->name('updatePasienicd9T');
});

require __DIR__.'/auth.php';
