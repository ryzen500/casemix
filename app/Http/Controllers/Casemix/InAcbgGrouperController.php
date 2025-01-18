<?php

namespace App\Http\Controllers\Casemix;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Casemix\Inacbg;
use App\Models\PendaftaranT;
use PaginationLibrary\Pagination;
use Inertia\Inertia;

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


    public function updateNewKlaim(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_kartu = $request->input('nomor_kartu') ?? "";
        $nomor_sep = $request->input('nomor_sep') ?? "";
        $tgl_masuk = $request->input('tgl_masuk') ?? "";
        $tgl_pulang = $request->input('tgl_pulang') ?? "";
        $jenis_rawat = $request->input('jenis_rawat') ?? "";
        $kelas_rawat = $request->input('kelas_rawat') ?? "";
        $adl_sub_acute = $request->input('adl_sub_acute') ?? "";
        $adl_chronic = $request->input('adl_chronic') ?? "";
        $icu_indikator = $request->input('icu_indikator') ?? "";
        $icu_los = $request->input('icu_los') ?? "";
        $ventilator_hour = $request->input('ventilator_hour') ?? "";
        $upgrade_class_ind = $request->input('upgrade_class_ind') ?? "";
        $upgrade_class_class = $request->input('upgrade_class_class') ?? "";
        $upgrade_class_los = $request->input("upgrade_class_los") ?? "";
        $birth_weight = $request->input("birth_weight") ?? "";
        $discharge_status = $request->input("discharge_status") ?? "";
        $diagnosa = $request->input("diagnosa") ?? "";
        $prosedur_non_bedah = $request->input("prosedur_non_bedah") ?? "";
        $prosedur_bedah = $request->input("prosedur_bedah") ?? "";
        $konsultasi = $request->input("konsultasi") ?? "";
        $tenaga_ahli = $request->input("tenaga_ahli") ?? "";
        $keperawatan = $request->input("keperawatan") ?? "";
        $penunjang = $request->input("penunjang") ?? "";
        $radiologi = $request->input("radiologi") ?? "";
        $laboratorium = $request->input("laboratorium") ?? "";
        $pelayanan_darah = $request->input("pelayanan_darah") ?? "";
        $rehabilitasi = $request->input("rehabilitasi") ?? "";
        $kamar = $request->input("kamar") ?? "";
        $rawat_intensif = $request->input(key: "rawat_intensif") ?? "";
        $obat = $request->input(key: "obat") ?? "";
        $alkes = $request->input(key: "alkes") ?? "";
        $bmhp = $request->input(key: "bmhp") ?? "";
        $sewa_alat = $request->input(key: "sewa_alat") ?? "";
        $tarif_poli_eks = $request->input(key: "tarif_poli_eks") ?? "";
        $nama_dokter = $request->input(key: "nama_dokter") ?? "";
        $kode_tarif = $request->input(key: "kode_tarif") ?? "";
        $payor_id = $request->input(key: "payor_id") ?? "";
        $payor_cd = $request->input(key: "payor_cd") ?? "";
        $cob_cd = $request->input(key: "cob_cd") ?? "";
        $coder_nik = $request->input(key: "coder_nik") ?? "";


        // Structur Payload 
        $data = [
            'nomor_kartu' => $nomor_kartu,
            'nomor_sep' => $nomor_sep,
            'tgl_masuk' => $tgl_masuk,
            'tgl_pulang' => $tgl_pulang,
            'jenis_rawat' => $jenis_rawat,
            'kelas_rawat' => $kelas_rawat,
            'adl_sub_acute'=> $adl_sub_acute,
            'adl_chronic'=>$adl_chronic,
            'icu_indikator'=>$icu_indikator,
            'icu_los'=>$icu_los,
            'ventilator_hour'=>$ventilator_hour,
            'upgrade_class_ind'=>$upgrade_class_ind,
            'upgrade_class_class'=>$upgrade_class_class,
            'upgrade_class_los'=>$upgrade_class_los,
            'birth_weight'=>$birth_weight,
            'discharge_status'=>$discharge_status,
            'diagnosa'=>$diagnosa,
            'prosedur_non_bedah'=>$prosedur_non_bedah,
            'prosedur_bedah'=>$konsultasi,
            'tenaga_ahli'=>$tenaga_ahli,
            'keperawatan'=>$keperawatan,
            'penunjang'=>$penunjang,
            'radiologi'=>$radiologi,
            'laboratorium'=>$laboratorium,
            'pelayanan_darah'=>$pelayanan_darah,
            'rehabilitasi'=>$rehabilitasi,
            'kamar'=>$kamar,
            'rawat_intensif'=>$rawat_intensif,
            'obat'=>$obat,
            'alkes'=>$alkes,
            'bmhp'=>$bmhp,
            'sewa_alat'=>$sewa_alat,
            'tarif_poli_eks'=>$tarif_poli_eks,
            'nama_dokter'=>$nama_dokter,
            'kode_tarif'=>$kode_tarif,
            'payor_id'=>$payor_id,
            'payor_cd'=>$payor_cd,
            'cob_cd'=>$cob_cd,
            'coder_nik'=>$coder_nik
        ];


        // result kirim claim
        $results = $this->inacbg->updateDataKlaim($data, $key);

        // Kembalikan hasil sebagai JSON response
        return response()->json($results, 200);
    }

    public function listReportClaim(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);


        // payload request Filter
        $filters = $request->only([
            'no_pendaftaran',
            'nosep',
            'tglrawat_masuk',
            'jenispelayanan',
            'nokartuasuransi',
            'nama_pasien',
            'dpjpygmelayani_nama',
            'ruangan_nama',
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

    public function searchGroupper(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);


        // payload request Filter
        $filters = $request->only([
            'no_rekam_medik',
            'nosep',
            'nama_pasien'
        ]);
        // Hitung total data
        $totalItems = Inacbg::dataListSepCount($filters);

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // Ambil data berdasarkan pagination
        $data = Inacbg::dataListSep($pagination->getLimit(), $pagination->getOffset(), $filters);

        // Kembalikan response JSON
        // return response()->json([
        //     'pagination' => $pagination->getPaginationInfo(),
        //     'data' => $data,
        // ]);
        return Inertia::render('Grouping/index', [
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
    }

    public function getSearchGroupper(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $itemsPerPage = request()->get('per_page', 10);

        // dd(vars: $itemsPerPage);

        // payload request Filter
        $filters = [
            'periode' => $request->input('periode') ?? null,
            'tanggal_mulai' => $request->input('tanggal_mulai') ?? null,
            'tanggal_selesai' => $request->input('tanggal_selesai') ?? null,
            'metodePembayaran' => $request->input('metodePembayaran') ?? null,
            'kelasRawat'=>$request->input('kelasRawat') ?? null,
            'status'=> $request->input('statusKlaim') ?? null,
            'jenisrawat'=>$request->input('jenisrawat') ?? null
        ];

        // Hitung total data

        $totalItems = Inacbg::dataListSepCount($filters);

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // dd($filters['tanggal_mulai']);

        // Ambil data berdasarkan pagination
        $data = Inacbg::dataListSep($pagination->getLimit(), $pagination->getOffset(), $filters);

        // Kembalikan response JSON
        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
        // return Inertia::render('Grouping/index', [
        //     'pagination' => $pagination->getPaginationInfo(),
        //     'data' => $data,
        // ]);
    }


    
    public function getSearchGroupperData(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $itemsPerPage = $request->input('items_per_page', 10);

        // dd($request);

        // payload request Filter
        $filters = [
            'query' => $request->input('query') ?? null,
        ];
        // dd($filters);

        // Hitung total data

        $totalItems = Inacbg::dataListSepCount($filters);

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // dd($filters['tanggal_mulai']);

        // Ambil data berdasarkan pagination
        $data = Inacbg::dataListSep($pagination->getLimit(), $pagination->getOffset(), $filters);

        // Kembalikan response JSON
        return response()->json([
            'pagination' => $pagination->getPaginationInfo(),
            'data' => $data,
        ]);
        // return Inertia::render('Grouping/index', [
        //     'pagination' => $pagination->getPaginationInfo(),
        //     'data' => $data,
        // ]);
    }

    public function searchGroupperPasien($pasien_id)
    {
        $model = PendaftaranT::dataListGrouper($pasien_id);
        return Inertia::render('Grouping/indexPasien', [
            'model' => $model
        ]);
    }
    public function getGroupperPasien($pendaftaran_id)
    {
        $model = PendaftaranT::getGroupping($pendaftaran_id);
        return response()->json([
            'model' => $model,
        ]);
    }
}
