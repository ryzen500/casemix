<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\LaporanresepR;
use App\Models\PasienPulangT;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PaginationLibrary\Pagination;

class LaporanSEPController extends Controller
{
    public function index(Request $request){
        // Parameter untuk pagination
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);

        // Hitung total data
        $totalItems = LaporanresepR::getTotalItems();

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // Ambil data berdasarkan pagination
        $data = LaporanresepR::getPaginatedData($pagination->getLimit(), $pagination->getOffset());

        // Kembalikan response JSON
        // return response()->json([
        //     'pagination' => $pagination->getPaginationInfo(),
        //     'data' => $data,
        // ]);
        return Inertia::render('Laporan/LaporanSEP/index', [
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }
}
