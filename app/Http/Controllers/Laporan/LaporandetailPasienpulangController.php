<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\PasienPulangT;
use Illuminate\Http\Request;

class LaporandetailPasienpulangController extends Controller
{
    //

    
    public function index(Request $request):void{

        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);

        $totalItems = PasienPulangT::getTotalItems();

        var_dump($totalItems);die;
    }

}
