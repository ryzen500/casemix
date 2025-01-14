<?php

namespace App\Http\Controllers\Casemix;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Casemix\Inacbg;
use PaginationLibrary\Pagination;

class InAcbgGrouperController extends Controller
{

    protected $inacbg;

    public function __construct(Inacbg $inacbg)
    {
        $this->inacbg = $inacbg;
    }
    /**
     * Display List InAcbgGroupper.
     */
    public function index(Request $request): mixed
    {
        // Parameter untuk pagination
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);

        // Hitung total data
        $totalItems = Inacbg::getTotalItems();

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // Ambil data berdasarkan pagination
        $data = Inacbg::getPaginatedData($pagination->getLimit(), $pagination->getOffset());

        // Kembalikan response JSON
        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }


    public function saveNewKlaim(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_kartu = $request->input('nomor_kartu') ?? null;
        $nomor_sep = $request->input('nomor_sep') ?? null;
        $nomor_rm = $request->input('nomor_rm') ?? null;
        $nama_pasien = $request->input('nama_pasien') ?? null;
        $tgl_lahir = $request->input('tgl_lahir') ?? null;
        $gender = $request->input('gender') ?? null;

        // Structur Payload 
        $data = [
            'nomor_kartu' => $nomor_kartu,
            'nomor_sep' => $nomor_sep,
            'nomor_rm' => $nomor_rm,
            'nama_pasien' => $nama_pasien,
            'tgl_lahir' => $tgl_lahir,
            'gender' => $gender,
        ];


        // result kirim claim
        $results = $this->inacbg->newClaim($data, $key);

        // Kembalikan hasil sebagai JSON response
        return response()->json($results, 200);
    }

    public function listReportClaim(Request $request) {
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);


        // payload request Filter
        $filters = $request->only([
            'no_pendaftaran', 'nosep', 'tglrawat_masuk',
            'jenispelayanan', 'nokartuasuransi','nama_pasien','dpjpygmelayani_nama','ruangan_nama',
        ]);
        // Hitung total data
        $totalItems = Inacbg::reportCountClaimReceivables($filters);

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // Ambil data berdasarkan pagination
        $data = Inacbg::reportClaimReceivables($pagination->getLimit(), $pagination->getOffset(), $filters);

        // Kembalikan response JSON
        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }

    public function searchGroupper(Request $request){
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);


        // payload request Filter
        $filters = $request->only([
            'no_rekam_medik', 'nosep','nama_pasien'
        ]);
        // Hitung total data
        $totalItems = Inacbg::dataListSepCount($filters);

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // Ambil data berdasarkan pagination
        $data = Inacbg::dataListSep($pagination->getLimit(), $pagination->getOffset(), $filters);

        // Kembalikan response JSON
        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }
    
}
