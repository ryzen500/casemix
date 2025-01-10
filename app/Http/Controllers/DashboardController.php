<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){

        $total_tarif_rs = DB::table('inacbg_t')
            ->selectRaw('SUM(total_tarif_rs) as total_tarif_rs, count(total_tarif_rs) as count_total')
            ->whereBetween('inacbg_tgl', [Carbon::now()->startOfMonth(),  Carbon::now()->endOfMonth()])
            ->first();
        $total_tarif_rs->total_tarif_rs=number_format($total_tarif_rs->total_tarif_rs,2,",",".");
        return Inertia::render('Dashboard', [
            'total_tarif_rs' => $total_tarif_rs ,
        ]);
    }
}
