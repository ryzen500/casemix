<?php

namespace App\Http\Controllers\Casemix;

use App\Http\Controllers\Controller;
use App\Http\Services\Action\SaveDataFinalisasiService;
use App\Http\Services\Action\SaveDataGroupperService;
use App\Http\Services\Action\SaveDataReeditKlaimService;
use App\Http\Services\groupingService;
use App\Http\Services\MonitoringHistoryService;
use App\Http\Services\Action\SaveDataKlaimService;

use App\Http\Services\SearchSepService;
use App\Models\CarabayarM;
use App\Models\CaraKeluarM;
use App\Models\InasismdcT;
use App\Models\LaporanresepR;
use App\Models\PasienMordibitasR;
use App\Models\PegawaiM;
use App\Models\PembayaranPelayananT;
use App\Models\PenjaminPasien;
use App\Models\TandaBuktiBayarT;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Casemix\Inacbg;
use App\Models\DiagnosaM;
use App\Models\KelompokdiagnosaM;
use App\Models\LoginPemakaiK;
use App\Models\LookupM;
use App\Models\Pasienicd9cmT;
use App\Models\PasienmorbiditasT;
use App\Models\PendaftaranT;
use App\Models\ProfilrumahsakitM;
use App\Models\SepT;
use PaginationLibrary\Pagination;
use Inertia\Inertia;
use App\Services\DataService;

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


        // dd($request->all);
        $nomor_kartu = $request->input('nomor_kartu') ?? null;
        $nomor_sep = $request->input('noSep') ?? null;
        $nomor_rm = $request->input('no_rekam_medik') ?? null;
        $nama_pasien = $request->input('nama_pasien') ?? null;
        $tgl_lahir = $request->input('tgl_lahir') ?? null;
        $gender = $request->input('gender') ?? null;
        if($gender =='P'){
            $gender =2;
        }else if("L"){
            $gender =1;
        }
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
        //if false and message =  Nomor Klaim sudah terpakai. Silakan generate_claim_number lagi. then generate claim number first
        // if($results['success']==false && $results['message']=='Nomor Klaim sudah terpakai. Silakan generate_claim_number lagi.'){
        //     // documentaion number 18
        //     $results2 = $this->inacbg->generate_claim_number($data, $key);
        //     $data = [
        //         'nomor_kartu' => $nomor_kartu,
        //         'nomor_sep' => $results2['data']['claim_number'],
        //         'nomor_rm' => $nomor_rm,
        //         'nama_pasien' => $nama_pasien,
        //         'tgl_lahir' => $tgl_lahir,
        //         'gender' => $gender,
        //     ];            
        //     // result kirim claim
        //     $results = $this->inacbg->newClaim($data, $key);
        // }
        // Kembalikan hasil sebagai JSON response
        return response()->json($results, 200);
    }


    public function printKlaim(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        // dd($request->all);
        $nomor_sep = $request->input('noSep') ?? null;

        // Structur Payload 
        $data = [
            'nomor_sep' => $nomor_sep,

        ];


        // result kirim claim
        $results = $this->inacbg->printKlaim($data, $key);

            // dd($results ===false);die;

        if ($results['success'] === false) {

            return response()->json(['data'=>$results], 200);
        } else {

            // var_dump($results["data"]);die;
            $base64Data = $this->getBase64FromNoSep($results["data"]);  // Ganti dengan logika Anda untuk mengambil base64

            // Menghilangkan prefix base64 jika ada
            if (preg_match('/^data:application\/pdf;base64,/', $base64Data)) {
                $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
            }

            // Decode base64 menjadi data binar
            $pdfData = base64_decode($base64Data);

            // Tentukan nama file PDF
            $fileName = 'klaim_' . $nomor_sep . '.pdf';

            // Kembalikan file PDF untuk diunduh
            return response()->stream(
                function () use ($pdfData) {
                    echo $pdfData;  // Menulis data PDF
                },
                200,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
                ]
            );
        }

    }

    private function getBase64FromNoSep($results)
    {
        // Implementasikan logika untuk mendapatkan data base64 berdasarkan noSep
        // Misalnya dari database atau layanan lain
        return "data:application/pdf;base64,$results";
    }


    public function updateNewKlaim(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_kartu = $request->input('nomor_kartu') ?? "";
        $nomor_sep = $request->input('noSep') ?? "";
        $tgl_masuk = Carbon::parse($request->input('tgl_masuk') ?? "")->setTimezone('Asia/Jakarta')->format('Y-m-d H:i:s');
        $cara_masuk = $request->input('cara_masuk') ?? "";

        $tgl_pulang = Carbon::parse($request->input('tgl_pulang') ?? "")->setTimezone('Asia/Jakarta')->format('Y-m-d H:i:s') ?? "";
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
        $upgrade_class_payor = $request->input("upgrade_class_payor") ?? "";


        $birth_weight = $request->input("birth_weight") ?? "";
        $discharge_status = $request->input("discharge_status") ?? "";
        $diagnosa = $request->input("diagnosa") ?? "";
        $diagnosa_inagrouper = $request->input("diagnosa_inagrouper") ?? "";
        
        $diagnosa_array = $request->input("diagnosa_array") ?? "";
        $diagnosaina_array = $request->input("diagnosaina_array") ?? "";
        $procedure_ix = $request->input("procedure_ix") ?? "";
        $procedureina_ix = $request->input("procedureina_ix") ?? "";


        $procedure = $request->input("procedure") ?? "";
        $procedure_inagrouper = $request->input("procedure_inagrouper") ?? "";


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
        $obat_kronis = $request->input(key: "obat_kronis") ?? "";
        $obat_kemoterapi = $request->input(key: "obat_kemoterapi") ?? "";


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
        $sistole = $request->input(key: "sistole") ?? "";
        $diastole = $request->input(key: "diastole") ?? "";
        $is_tb = $request->input(key: "is_tb");
        $nomor_register_sitb = $request->input('nomor_register_sitb') ?? null;
        //Data DB
        $carabayar_id = $request->input(key: "carabayar_id") ?? "";
        $carabayar_nama = $request->input(key: "carabayar_nama") ?? "";

        $caramasuk_id = $request->input(key: "caramasuk_id") ?? "";
        $carakeluar_id = $request->input(key: "carakeluar_id") ?? "";
        $umur_pasien = $request->input(key: "umur_pasien") ?? "";

        $loginpemakai_id = $request->input(key: "loginpemakai_id") ?? "";
        $pendaftaran_id = $request->input(key: "pendaftaran_id") ?? "";
        $total_tarif_rs = $request->input(key: "total_tarif_rs") ?? "";
        $berat_lahir = $request->input(key: "berat_lahir") ?? "";
        $los= $request->input(key: "los") ?? "";

        $jaminan_id = $request->input(key: "jaminan_id") ?? "";
        $carabayar = CarabayarM::getCarabayarById($jaminan_id);

        // dd($years);
        // Structur Payload 
        $data = [
            'nomor_kartu' => $nomor_kartu,
            'nomor_sep' => $nomor_sep,
            'tgl_masuk' => $tgl_masuk,
            'cara_masuk' => $cara_masuk,
            'tgl_pulang' => $tgl_pulang,
            'jenis_rawat' => $jenis_rawat,
            'kelas_rawat' => $kelas_rawat,
            'adl_sub_acute' => $adl_sub_acute,
            'adl_chronic' => $adl_chronic,
            'icu_indikator' => $icu_indikator,
            'icu_los' => $icu_los,
            'ventilator_hour' => $ventilator_hour,
            'upgrade_class_ind' => $upgrade_class_ind,
            'upgrade_class_class' => $upgrade_class_class,
            'upgrade_class_los' => $upgrade_class_los,
            'upgrade_class_payor' => $upgrade_class_payor,
            'birth_weight' => $birth_weight,
            'discharge_status' => $discharge_status,
            'diagnosa' => $diagnosa,
            'diagnosa_inagrouper' => $diagnosa_inagrouper,
            'procedure' => $procedure,
            'procedure_inagrouper' => $procedure_inagrouper,
            'sistole' => $sistole,
            'diastole' => $diastole,
            'prosedur_non_bedah' => $prosedur_non_bedah,
            'prosedur_bedah' => $prosedur_bedah,
            'konsultasi' => $konsultasi,
            'tenaga_ahli' => $tenaga_ahli,
            'keperawatan' => $keperawatan,
            'penunjang' => $penunjang,
            'radiologi' => $radiologi,
            'laboratorium' => $laboratorium,
            'pelayanan_darah' => $pelayanan_darah,
            'rehabilitasi' => $rehabilitasi,
            'kamar' => $kamar,
            'rawat_intensif' => $rawat_intensif,
            'obat' => $obat,
            'obat_kronis' => $obat_kronis,
            'obat_kemoterapi' => $obat_kemoterapi,
            'alkes' => $alkes,
            'bmhp' => $bmhp,
            'sewa_alat' => $sewa_alat,
            'tarif_poli_eks' => $tarif_poli_eks,
            'nama_dokter' => $nama_dokter,
            'kode_tarif' => $kode_tarif,
            'payor_id' => $payor_id,
            'payor_cd' => $payor_cd,
            'cob_cd' => $cob_cd,
            'coder_nik' => $coder_nik,
            'loginpemakai_id' => $loginpemakai_id,
            'jaminan_id' => $carabayar->carabayar_id,
            'jaminan_nama' => $carabayar->carabayar_nama
        ];

        // Payload Pendaftaran 
        $dataSep = LaporanresepR::where('nosep', $nomor_sep)->first();
        $dataDiagnosa = PasienmorbiditasT::insertMorbiditasByPendaftaran($pendaftaran_id)->toArray();

        //Procedural
        $dataIcd9cm = Pasienicd9cmT::getIcdIX($pendaftaran_id)->toArray();

        // $diagnosa_explode = explode('#', $diagnosa);


        // Temporary Table 

        // $dataDiagnosaRiwayat = PasienMordibitasR::getMorbiditas($pendaftaran_id)->toArray();

        $decodedRiwayat = json_decode($diagnosa_array, true);
        $decodedRiwayatINA = json_decode($diagnosaina_array, true);
        $decodedProcedure = json_decode($procedure_ix, true);
        $decodedProcedureINA = json_decode($procedureina_ix,true);
        // dd(json_decode($diagnosa_array,true));

        // // echo "<pre>"; var_dump($dataDiagnosa);die;
        // dd($dataDiagnosaRiwayat);
        $pendaftaran = [
            'carabayar_id' => $carabayar_id,
            'carabayar_nama' => $carabayar_nama,
            'caramasuk_id' => $caramasuk_id,
            'carakeluar_id' => $carakeluar_id,
            'umur_pasien' => $umur_pasien,
            'sep_id' => $dataSep['sep_id'],
            'create_loginpemakai_id' => $loginpemakai_id,
            'total_tarif_rs' => $total_tarif_rs,
            'berat_lahir' => $berat_lahir,
            'is_tb' => $is_tb,
            'nomor_register_sitb' => $nomor_register_sitb,
            'los'=>$los
        ];


        $saveService = new SaveDataKlaimService();

        //refactor code 



        // Endpoint
        $results = $this->inacbg->updateDataKlaim($data, $key);

        // dd($results);
        if ($results['success'] === true) {

            $saveResult = $saveService->addDataInacbgT($data, $pendaftaran);

            // dd($saveResult);

            if ($decodedRiwayat) {
                // $saveDiagnosa = $saveService->addDataPasienMordibitasRiwayat($data, $pendaftaran, $dataDiagnosa);

                // $deletePasienMordibitasT = $saveService->DeleteDataPasienMordibitas($data, $pendaftaran, $decodedRiwayat);

                $addUNU = $saveService->addDataPasienMordibitasUNU($data, $pendaftaran, $decodedRiwayat);
            }

            if ($decodedRiwayatINA) {
                $addINA = $saveService->addDataPasienMordibitasINA($data, $pendaftaran, $decodedRiwayatINA);

            }

            if ($decodedProcedure) {
                $addIXUNU = $saveService->addDataPasienMordibitasIXUNU($data, $pendaftaran, $decodedProcedure);

            }
            if ($decodedProcedureINA) {
                $addIXINA = $saveService->addDataPasienMordibitasIXINA($data, $pendaftaran, $decodedProcedureINA);

            }

            // Jika berhasil, kirim klaim
            return response()->json($results, 200);
        } else {
            // Jika gagal, kembalikan pesan error
            return response()->json( $results, 200);
        }


    }



    public function deleteKlaim(Request $request)
    {


        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        // dd($request->all);
        $nomor_sep = $request->input('nomor_sep') ?? null;
        $coder_nik = $request->input('coder_nik') ?? null;

        // Structur Payload 
        $data = [
            'nomor_sep' => $nomor_sep,
            'coder_nik' => $coder_nik,
        ];


        // result kirim claim
        $results = $this->inacbg->deleteKlaim($data, $key);
        $getClaim = $this->getKlaim($data['nomor_sep']);

        // Kembalikan hasil sebagai JSON response
        return response()->json([$results,$getClaim], 200);
    }

    public function groupingStageSatu(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_sep = $request->input('nomor_sep') ?? "";
        $loginpemakai_id = $request->input(key: "loginpemakai_id") ?? "";


        // $diagnosa = explode(' ', $diagnosa);
        // ICDX


        //Pengecekan
        // dd($dataDiagnosa);
        // var_dump($dataDiagnosa);die;

        // Structur Payload  hit  api
        $data = [
            'nomor_sep' => $nomor_sep,

        ];

        // display data 

        $dataAuthor = [
            'create_loginpemakai_id' => $loginpemakai_id
        ];


        // result kirim claim
        $results = $this->inacbg->groupingStageSatu($data, $key);

        // dd($results['data']['cbg']['code']);

        // dd($saveResult);
        // Kembalikan hasil sebagai JSON response
        $getClaim = $this->getKlaim($data['nomor_sep']);
        // if ($saveResult['status'] === 'success') {
        if ($results['success'] === true) {

            $saveService = new SaveDataGroupperService();
            $saveResult = $saveService->addDataInasiscbg($results, $data, $dataAuthor);
            $saveResults = $saveService->addDataInasisdmc($results, $data, $dataAuthor);
// dd($saveResults);
            if($saveResult['status']=== 'success' && $saveResults['status'] === 'success') {
               $datas = [$results,$getClaim];
            }
            // Jika berhasil, kirim klaim
            return response()->json($datas, 200);
        } else {
            // Jika gagal, kembalikan pesan error
            return response()->json($results, 400);

        }
    }



    public function kirimIndividualKlaim(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_sep = $request->input('nomor_sep') ?? "";
        $coder_nik = $request->input('coder_nik') ?? "";

        $getLoginPemakai[] = LoginPemakaiK::where(['coder_nik'=>$coder_nik])->first();
        // dd($getLoginPemakai['loginpemakai_id']);
        // Structur Payload 
        $data = [
            'nomor_sep' => $nomor_sep,

        ];


        // result kirim claim
        $results = $this->inacbg->kirimOnlineKlaim($data, $key);


        // if ($results['success'] === true) {
        //     // $saveService = new SaveDataReeditKlaimService();
        //     // $saveResult = $saveService->deleteFlagDataFinalisasi($data, $getLoginPemakai);
        // }

        // Kembalikan hasil sebagai JSON response
        return response()->json($results, 200);
    }

    public function EditUlangKlaim(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_sep = $request->input('nomor_sep') ?? "";
        $coder_nik = $request->input('coder_nik') ?? "";

        $getLoginPemakai[] = LoginPemakaiK::where(['coder_nik'=>$coder_nik])->first();
        // dd($getLoginPemakai['loginpemakai_id']);
        // Structur Payload 
        $data = [
            'nomor_sep' => $nomor_sep,

        ];


        // result kirim claim
        $results = $this->inacbg->reeditclaim($data, $key);
        $getClaim = $this->getKlaim($data['nomor_sep']);


        if ($results['success'] === true) {
            $saveService = new SaveDataReeditKlaimService();
            $saveResult = $saveService->deleteFlagDataFinalisasi($data, $getLoginPemakai);
        }

        // Kembalikan hasil sebagai JSON response
        return response()->json([$results,$getClaim], 200);
    }


    public function Finalisasi(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_sep = $request->input('nomor_sep') ?? "";
        $coder_nik = $request->input('coder_nik') ?? "";

        $getLoginPemakai[] = LoginPemakaiK::where(['coder_nik'=>$coder_nik])->first();
        // dd($getLoginPemakai['loginpemakai_id']);
        // Structur Payload 
        $data = [
            'nomor_sep' => $nomor_sep,
            'coder_nik' => $coder_nik,

        ];


        // result kirim claim
        $results = $this->inacbg->finalisasi($data, $key);

        $getClaim = $this->getKlaim($data['nomor_sep']);

        if ($results['success'] === true) {
            $saveService = new SaveDataFinalisasiService();
            $saveResult = $saveService->updateDataFinalisasi($data, $getLoginPemakai);
        }

        // Kembalikan hasil sebagai JSON response
        return response()->json([$results,$getClaim], 200);
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
        $itemsPerPage = request()->get('per_page', 100);

        // dd(vars: $itemsPerPage);

        // payload request Filter
        $filters = [
            'periode' => $request->input('periode') ?? null,
            'tanggal_mulai' => $request->input('tanggal_mulai') ?? null,
            'tanggal_selesai' => $request->input('tanggal_selesai') ?? null,
            'metodePembayaran' => $request->input('metodePembayaran') ?? null,
            'kelasRawat' => $request->input('kelasRawat') ?? null,
            'status' => $request->input('statusKlaim') ?? null,
            'jenisrawat' => $request->input('jenisRawat') ?? null,
            'nosep' => $request->input('nosep') ?? null,
            'nama_pasien' => $request->input('nama_pasien') ?? null,
        ];

        // Hitung total data
        // dd($filters);
        $totalItems = SepT::dataListSepCount($filters);

        // Inisialisasi pagination
        $pagination = new Pagination($totalItems, $itemsPerPage, $currentPage);

        // dd($filters['tanggal_mulai']);

        // Ambil data berdasarkan pagination
        // $data = Inacbg::dataListSep($pagination->getLimit(), $pagination->getOffset(), $filters);
        $data = SepT::dataListSep( $pagination->getLimit(), $pagination->getOffset(), $filters);
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
        $itemsPerPage = $request->input('items_per_page', 5);

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

    public function searchGroupperPasien($nopeserta)
    {
        $model = new MonitoringHistoryService();
        $getRiwayat = $model->getRiwayatData($nopeserta)->getOriginalContent();
        $data = null;
        $pasien = null;
        if (isset($getRiwayat['response'])) {
            if (count($getRiwayat['response']) > 0) {
                foreach ($getRiwayat['response']['histori'] as $key => $row) {
                    $sep = SepT::getSep($row['noSep']);
                    $data[] = $row;
                    // dd($data,$sep,!empty($sep));
                    $getClaim = $this->getKlaim($row['noSep']);

                    if (!empty($sep)) {
                        $data[$key]['pendaftaran_id'] = $sep->pendaftaran_id;
                        $pasien['nama_pasien'] = $sep->nama_pasien;
                        $pasien['no_rekam_medik'] = $sep->no_rekam_medik;
                        $pasien['jeniskelamin'] = $sep->jeniskelamin;
                        $pasien['tanggal_lahir'] = $sep->tanggal_lahir;

                    } else {
                        $data[$key]['pendaftaran_id'] = null;
                    }

                    // var_dump($getClaim);die;
                    // dd($getClaim);
                    if (!empty($getClaim['data']['data'])) {
                        $data[$key]['tglSep'] = $getClaim['data']['data']['tgl_masuk'];
                        $data[$key]['tglPlgSep'] = $getClaim['data']['data']['tgl_pulang'];
                        $data[$key]['jaminan'] = $getClaim['data']['data']['payor_nm'];
                        $tipe = '-';
                        if ($getClaim['data']['data']['jenis_rawat'] == 1) {
                            $tipe = 'RI';
                        } else if ($getClaim['data']['data']['jenis_rawat'] == 2) {
                            $tipe = 'RJ';
                        } else if ($getClaim['data']['data']['jenis_rawat'] == 3) {
                            $tipe = 'RD';
                        }
                        $data[$key]['tipe'] = $tipe;

                        $data[$key]['cbg'] = !empty($getClaim['data']['data']['grouper']['response']) ? $getClaim['data']['data']['grouper']['response']['cbg']['code'] : "-";
                        $data[$key]['status'] = !empty($getClaim['data']['data']['klaim_status_cd']) ? $getClaim['data']['data']['klaim_status_cd'] : "-";
                        if (!empty($getClaim['data']['data']['coder_nik'])) {
                            $peg = LoginPemakaiK::getCoder($getClaim['data']['data']['coder_nik']);
                            $data[$key]['nama_pegawai'] = !empty($peg) ? $peg->namaLengkap : '-';
                        } else if(!empty($getClaim['data']['data']['coder_nm'])){
                            $data[$key]['nama_pegawai'] = $getClaim['data']['data']['coder_nm'];
                        } else {
                            $data[$key]['nama_pegawai'] = '-';
                        }
                    }

                }
            }
        }
        // for dropdown
        $caraMasuk = LookupM::getLookupType('inacbgs_caramasuk');
        $caraPulang = CaraKeluarM::getDataListKeluar();
        $Jaminan = CarabayarM::getCarabayar();

        $jenisKasus = LookupM::getLookupType('kasusdiagnosa');
        $kelompokDiagnosa = KelompokdiagnosaM::getKelompokDiagnosa();
        $COB = PenjaminPasien::getLookupType();

        // var_dump($COB);die;
        $DPJP = PegawaiM::getPegawaiDPJP('1');
        $pegawai = PegawaiM::getPegawaiDPJP('1');
        // $model = PendaftaranT::dataListGrouper($nopeserta);
        return Inertia::render('Grouping/indexPasien', [
            'model' => $data,
            'pasien' => $pasien,
            'caraMasuk' => $caraMasuk,
            'Jaminan'=>$Jaminan,
            'caraPulang' => $caraPulang,
            'DPJP' => $DPJP,
            'jenisKasus' => $jenisKasus,
            'pegawai' => $pegawai,
            'kelompokDiagnosa' => $kelompokDiagnosa,
            'COB' => $COB
        ]);
    }
    public function getGroupperPasien(Request $request)
    {
        $noSep = $request->input('noSep');
        $pendaftaran_id = $request->input('pendaftaran_id');
        $diagnosa = $request->input('diagnosa');
        $diagnosa = explode(' ', $diagnosa);
        $dataDiagnosa = PasienmorbiditasT::getMorbiditas($pendaftaran_id);
        $dataIcd9cm = Pasienicd9cmT::getIcdIX($pendaftaran_id);
        $model = new SearchSepService();
        $getRiwayat = $model->getRiwayatData($noSep)->getOriginalContent();
        $pendaftaran = PendaftaranT::getDataGroup($pendaftaran_id);
        $tarif = PendaftaranT::getTarif($pendaftaran_id);
        $tarifBelumBayar = PendaftaranT::getTarifTotal($pendaftaran_id);

        $obat = PendaftaranT::getGroupping($pendaftaran_id);
        $obatBelumBayar = PendaftaranT::getGrouppingBelumBayar($pendaftaran_id);

        $profil = ProfilrumahsakitM::getProfilRS();
        $SEP = Inacbg::where('inacbg_nosep', $noSep)->first();
        $Inasismdc = InasismdcT::where('pendaftaran_id', $pendaftaran_id)->first();
        $PembayaranPelayananT = PembayaranPelayananT::where('pendaftaran_id', $pendaftaran_id)->first();
        // var_dump($PembayaranPelayananT->pembayaranpelayanan_id);die;
       $total_simrs = 0 ;
        if(!empty($PembayaranPelayananT)){


            $TandabuktiBayarT = TandaBuktiBayarT::where('pembayaranpelayanan_id', $PembayaranPelayananT->pembayaranpelayanan_id)->first();
            $total_simrs = $TandabuktiBayarT->jmlpembayaran - $PembayaranPelayananT->selisihuntungrugibpjs;
        }else{
            $total_simrs = ($tarifBelumBayar->tarif_tindakan ?? 0) + ($obatBelumBayar->hargajual_oa ?? 0);

        }



        $serviceGrouping = new groupingService($this->inacbg);
        $getGrouping = $serviceGrouping->callDataGrouping($noSep);
        return response()->json([
            'model' => $getRiwayat,
            'pendaftaran' => $pendaftaran,
            'tarif' => $tarif,
            'tarifBelumBayar'=>$tarifBelumBayar,
            'obat' => $obat,
            'profil' => $profil,
            'dataDiagnosa' => $dataDiagnosa,
            'dataIcd9cm' => $dataIcd9cm,
            'Inasismdc'=>$Inasismdc,
            'inacbg' => $SEP,
            'total_simrs'=> $total_simrs,
            'getGrouping' => $getGrouping
        ]);
    }
    public function getClaimData(Request $request){
        $noSep = $request->input('noSep');
        $serviceGrouping = new groupingService($this->inacbg);
        $getGrouping = $serviceGrouping->callDataGrouping($noSep);
        return response()->json([
            'getGrouping' => $getGrouping
        ]);
    }
    public function getKlaim($noSep)
    {
        // Ambil keynya dari  ENV 
        $key_ina = env('INACBG_KEY');


        // dd($request->all);
        $nomor_sep = $noSep ?? null;

        // Structur Payload 
        $data_ina = [
            'nomor_sep' => $nomor_sep,

        ];


        // result kirim claim
        return $this->inacbg->getClaim($data_ina, $key_ina);
    }

    public function validateSITB(Request $request)
    {
        // Ambil keynya dari  ENV 
        $key_ina = env('INACBG_KEY');


        // dd($request->all);
        $nomor_sep = $request->input('nomor_sep') ?? null;

        $nomor_register_sitb = $request->input('nomor_register_sitb') ?? null;

        // Structur Payload 
        $payload = [
            'nomor_sep' => $nomor_sep,
            'nomor_register_sitb' => $nomor_register_sitb,

        ];


        // result kirim claim
        return $this->inacbg->validateSITB($payload, $key_ina);

    }
}
