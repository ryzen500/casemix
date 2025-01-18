<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\Casemix\Inacbg;
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


        $filters = $request->only([
            'tgl_sep',
        ]);
       
        return Inertia::render('Laporan/LaporanSEP/index');
    }

    public function getData(Request $request)
    {
        $currentPage = request()->get('page', 1);
        $itemsPerPage = request()->get('items_per_page', 10);
        // $filters = $request->only([
        //     'range','tanggal_mulai','tanggal_selesai',
        // ]);
        // var_dump($request)
        $filters =[
            'range'=>request()->get('range'),
            'tanggal_mulai'=>request()->get('tanggal_mulai'),
            'tanggal_selesai'=>request()->get('tanggal_selesai'),
        ];
        // Hitung total data
        $totalItems = LaporanresepR::getTotalItems($filters);

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // Ambil data berdasarkan pagination
        $data = LaporanresepR::getPaginatedData($pagination->getLimit(), $pagination->getOffset(),$filters);
        // return $data;
        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }
}
