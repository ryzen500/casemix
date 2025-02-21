<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\CarabayarM;
use App\Models\InstalasiM;
use App\Models\PasienM;
use App\Models\PegawaiM;
use App\Models\PenjaminPasien;
use App\Models\RuanganM;
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
        $currentPage = request()->get('page', 1);
        $itemsPerPage = request()->get('per_page', 10);


     
        // payload request Filter
        $filters = $request->only([
            'no_pendaftaran', 'ruangan', 'dokter',
            'statusperiksa', 'kunjungan', 'no_rekam_medik', 'nama_pasien',
            'instalasi', 'jenisRawat','jenisPenjamin','ruangan',
        ]);
        $totalItems = PasienM::getTotalItems($filters);

        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        $data = PasienM::getPaginatedData($pagination->getLimit(), $pagination->getOffset(), $filters);
        $CaraBayarM = CarabayarM::getCarabayarByAll();

        $PenjaminPasien = PenjaminPasien::getPenjaminPasien();

        $Instalasi = InstalasiM::getInstalasi();

        $Ruangan = RuanganM::getRuangan();

        $Dokter = PegawaiM::getPegawaiDPJP(1);


        return Inertia::render('LaporanBukuRegister/index',[
            'CaraBayarM'=>$CaraBayarM,
            'PenjaminPasien'=>$PenjaminPasien,
            'Instalasi'=>$Instalasi,
            'Ruangan'=>$Ruangan,
            'Dokter'=>$Dokter
        ]);

    }
    public function getData(Request $request)
    {
        // Parameter untuk pagination
        $currentPage = request()->get('page', 1);
        $itemsPerPage = request()->get('per_page', 10);


        // payload request Filter
        $filters = $request->only([
            'no_pendaftaran', 'ruangan', 'dokter',
            'statusperiksa', 'kunjungan', 'no_rekam_medik', 'nama_pasien',
            'instalasi', 'jenisRawat','jenisPenjamin','ruangan','tanggal_mulai','tanggal_selesai',
        ]);

        // dd($filters);
        $totalItems = PasienM::getTotalItems($filters);

        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        $data = PasienM::getPaginatedData($pagination->getLimit(), $pagination->getOffset(), $filters);

        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }
}
