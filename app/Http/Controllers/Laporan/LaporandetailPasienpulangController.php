<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\PasienPulangT;
use Illuminate\Http\Request;
use PaginationLibrary\Pagination;

class LaporandetailPasienpulangController extends Controller
{
    //


    /**
     * Summary of index (Listing Laporan Detail PasienPulang)
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function index(Request $request): mixed
    {
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);
    
        // payload request Filter
        $filters = $request->only([
            'no_pendaftaran', 'carakeluar_id', 'kondisikeluar_id',
            'carabayar_id', 'penjamin_id', 'no_rm', 'nama_pasien',
            'instalasi_id', 'ruangan_id', 'pegawai_id',
        ]);
    
        // Total items dengan filter
        $totalItems = PasienPulangT::getTotalItems($filters);
    
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);
    
        // Data dengan filter dan pagination
        $data = PasienPulangT::getPaginatedData($pagination->getLimit(), $pagination->getOffset(), $filters);
    
        // Response JSON
        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }
    

}
