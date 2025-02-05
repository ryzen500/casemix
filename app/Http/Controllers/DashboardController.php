<?php

namespace App\Http\Controllers;

use App\Models\Casemix\Inacbg;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){

        $total_tarif_rs = Inacbg::getDashboard();
        $total_tarif_rs->total_tarif_rs=number_format($total_tarif_rs->total_tarif_rs,2,",",".");
        $total_tarif_rs->tarifgruper=number_format($total_tarif_rs->tarifgruper,2,",",".");
        return Inertia::render('Dashboard', [
            'total_tarif_rs' => $total_tarif_rs ,
        ]);
    }
}
