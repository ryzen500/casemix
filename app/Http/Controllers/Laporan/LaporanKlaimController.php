<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\Casemix\Inacbg;
use App\Models\InformasiSepGrouping;
use App\Models\LaporanresepR;
use App\Models\PasienPulangT;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PaginationLibrary\Pagination;

class LaporanKlaimController extends Controller
{
    public function index(Request $request){
        // Parameter untuk pagination
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);


        $filters = $request->only([
            'tgl_sep',
        ]);
       
        return Inertia::render('Laporan/LaporanKlaim/index');
    }

    public function getData(Request $request)
    {
        $currentPage = request()->get('page', 1);
        $itemsPerPage = request()->get('per_page', 10);
        // $filters = $request->only([
        //     'range','tanggal_mulai','tanggal_selesai',
        // ]);
        // var_dump($request)
        $filters =[
            'range'=>request()->get('range'),
            'tanggal_mulai'=>request()->get('tanggal_mulai'),
            'tanggal_selesai'=>request()->get('tanggal_selesai'),
            'nosep'=>request()->get('nosep'),
            'periode'=>request()->get('periode'),
            'jenisRawat'=>request()->get('jenisRawat'),
            'kelasRawat'=>request()->get('kelasRawat'),
            'nama_pasien'=>request()->get('nama_pasien')
        ];
        // Hitung total data
        $totalItems = InformasiSepGrouping::getTotalItems($filters);

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        $data = InformasiSepGrouping::getPaginatedData($pagination->getLimit(), $pagination->getOffset(),$filters);

        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }
}
