<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Casemix\InAcbgGrouperController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Laporan\LaporanSEPController;
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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
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
    
    // transaksi
    Route::post('newClaim', [InAcbgGrouperController::class, 'saveNewKlaim'])->name('newClaim');
    Route::get('searchGroupper', [InAcbgGrouperController::class, 'searchGroupper'])->name('searchGroupper');
    Route::post('getSearchGroupper', [InAcbgGrouperController::class, 'getSearchGroupper'])->name('getSearchGroupper');
    Route::post('getSearchGroupperData', [InAcbgGrouperController::class, 'getSearchGroupperData'])->name('getSearchGroupperData');
    Route::get('searchGroupperPasien/{id}', [InAcbgGrouperController::class, 'searchGroupperPasien'])->name('searchGroupperPasien');
    Route::post('getGroupperPasien/', [InAcbgGrouperController::class, 'getGroupperPasien'])->name('getGroupperPasien');


});

require __DIR__.'/auth.php';
