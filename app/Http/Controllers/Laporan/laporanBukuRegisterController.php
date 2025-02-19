<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\PasienM;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PaginationLibrary\Pagination;

class laporanBukuRegisterController extends Controller
{
    //


    protected $pasien;

    public function __construct(PasienM $pasien)
    {
        $this->pasien = $pasien;
    }


    public function index(Request $request)
    {
        // Parameter untuk pagination
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);


        // payload request Filter
        $filters = $request->only([
            'no_pendaftaran', 'carakeluar_id', 'kondisikeluar_id',
            'carabayar_id', 'penjamin_id', 'no_rm', 'nama_pasien',
            'instalasi_id', 'ruangan_id', 'pegawai_id',
        ]);
        $totalItems = PasienM::getTotalItems($filters);

        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        $data = PasienM::getPaginatedData($pagination->getLimit(), $pagination->getOffset(), $filters);

        return Inertia::render('LaporanBukuRegister/index');

    }
    public function getData(Request $request)
    {
        // Parameter untuk pagination
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);


        // payload request Filter
        $filters = $request->only([
            'no_pendaftaran', 'carakeluar_id', 'kondisikeluar_id',
            'carabayar_id', 'penjamin_id', 'no_rm', 'nama_pasien',
            'instalasi_id', 'ruangan_id', 'pegawai_id',
        ]);
        $totalItems = PasienM::getTotalItems($filters);

        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        $data = PasienM::getPaginatedData($pagination->getLimit(), $pagination->getOffset(), $filters);

        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }
}
