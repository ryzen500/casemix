<?php

namespace App\Http\Controllers\Casemix;

use App\Http\Controllers\Controller;
use App\Http\Services\groupingService;
use App\Http\Services\MonitoringHistoryService;
use App\Http\Services\Action\SaveDataKlaimService;

use App\Http\Services\SearchSepService;
use App\Models\LaporanresepR;
use App\Models\PasienMordibitasR;
use App\Models\PegawaiM;
use App\Models\PenjaminPasien;
use Illuminate\Http\Request;
use App\Models\Casemix\Inacbg;
use App\Models\DiagnosaM;
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
        $tgl_masuk = $request->input('tgl_masuk') ?? "";
        $cara_masuk = $request->input('cara_masuk') ?? "";
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
        $upgrade_class_payor = $request->input("upgrade_class_payor") ?? "";


        $birth_weight = $request->input("birth_weight") ?? "";
        $discharge_status = $request->input("discharge_status") ?? "";
        $diagnosa = $request->input("diagnosa") ?? "";
        $diagnosa_inagrouper = $request->input("diagnosa_inagrouper") ?? "";
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

        //Data DB
        $carabayar_id = $request->input(key: "carabayar_id") ?? "";
        $carabayar_nama = $request->input(key: "carabayar_nama") ?? "";
        $umur_pasien = $request->input(key: "umur") ?? "";
        $loginpemakai_id = $request->input(key: "loginpemakai_id") ?? "";
        $pendaftaran_id = $request->input(key: "pendaftaran_id") ?? "";

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
            'coder_nik' => $coder_nik
        ];

        // Payload Pendaftaran 
        $dataSep = LaporanresepR::where('nosep',$nomor_sep)->first();
        $dataDiagnosa = PasienmorbiditasT::insertMorbiditasByPendaftaran($pendaftaran_id)->toArray();
      
        //Procedural
        $dataIcd9cm = Pasienicd9cmT::getIcdIX($pendaftaran_id);

        // $diagnosa_explode = explode('#', $diagnosa);


        // Temporary Table 

        $dataDiagnosaRiwayat = PasienMordibitasR::getMorbiditas($pendaftaran_id)->toArray();

        // // echo "<pre>"; var_dump($dataDiagnosa);die;
        // dd($dataDiagnosaRiwayat);
        $pendaftaran = [
            'carabayar_id' => $carabayar_id,
            'carabayar_nama' => $carabayar_nama,
            'umur_pasien' => $umur_pasien,
            'sep_id'=>$dataSep['sep_id'],
            'create_loginpemakai_id'=>$loginpemakai_id
        ];


        $saveService = new SaveDataKlaimService();
        $saveResult = $saveService->addDataInacbgT($data, $pendaftaran);
        $saveDiagnosa = $saveService->addDataPasienMordibitasRiwayat($data, $pendaftaran, $dataDiagnosa);
        $deletePasienMordibitasT = $saveService->DeleteDataPasienMordibitas($data, $pendaftaran, $dataDiagnosa);
        $addDataPasienMordibitas = $saveService->addDataPasienMordibitas($data, $pendaftaran, $dataDiagnosaRiwayat);

        // var_dump($saveResult['s']);die;
        if ($saveResult['status'] === 'success') {
            // Jika berhasil, kirim klaim
            $results = $this->inacbg->updateDataKlaim($data, $key);
            return response()->json($results, 200);
        } else {
            // Jika gagal, kembalikan pesan error
            return response()->json([
                'status' => 'error',
                'message' => $saveResult['message']
            ], 400);
        }
        // $saveResult = $saveService->addDataInacbgT($data, $pendaftaran);
        //     // result kirim claim
        //     $results = $this->inacbg->updateDataKlaim($data, $key);

        //     // Kembalikan hasil sebagai JSON response
        //     return response()->json($results, 200);

    }




    public function groupingStageSatu(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_sep = $request->input('nomor_sep') ?? "";


        // $diagnosa = explode(' ', $diagnosa);
        // ICDX


        //Pengecekan
        // dd($dataDiagnosa);
        // var_dump($dataDiagnosa);die;
        // Structur Payload 
        $data = [
            'nomor_sep' => $nomor_sep,

        ];

        // GetData

        // result kirim claim
        $results = $this->inacbg->groupingStageSatu($data, $key);

        // Kembalikan hasil sebagai JSON response
        return response()->json($results, 200);
    }


    public function Finalisasi(Request $request)
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        $nomor_sep = $request->input('nomor_sep') ?? "";
        $coder_nik = $request->input('coder_nik') ?? "";

        // Structur Payload 
        $data = [
            'nomor_sep' => $nomor_sep,
            'coder_nik' => $coder_nik,

        ];


        // result kirim claim
        $results = $this->inacbg->finalisasi($data, $key);

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
            'kelasRawat' => $request->input('kelasRawat') ?? null,
            'status' => $request->input('statusKlaim') ?? null,
            'jenisrawat' => $request->input('jenisrawat') ?? null
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
                    if(!empty($getClaim['data']['data'])){
                        $data[$key]['tglSep'] = $getClaim['data']['data']['tgl_masuk'];
                        $data[$key]['tglPlgSep'] = $getClaim['data']['data']['tgl_pulang'];
                        $data[$key]['jaminan'] = $getClaim['data']['data']['payor_nm'];
                        $tipe ='-';
                        if($getClaim['data']['data']['jenis_rawat']==1){
                            $tipe ='RI';
                        }else if($getClaim['data']['data']['jenis_rawat']==2){
                            $tipe ='RJ';
                        }else if($getClaim['data']['data']['jenis_rawat']==3){
                            $tipe ='RD';
                        }
                        $data[$key]['tipe'] = $tipe;

                        $data[$key]['cbg'] = !empty($getClaim['data']['data']['grouper']['response'])?$getClaim['data']['data']['grouper']['response']['cbg']['code']:"-";
                        $data[$key]['status'] =!empty($getClaim['data']['data']['klaim_status_cd'])?$getClaim['data']['data']['klaim_status_cd']:"-";
                        if(!empty($getClaim['data']['data']['coder_nik'])){
                            $peg = LoginPemakaiK::getCoder($getClaim['data']['data']['coder_nik']);
                            $data[$key]['nama_pegawai'] = !empty($peg)?$peg->namaLengkap:'-';
                        }else{
                            $data[$key]['nama_pegawai'] ='-';
                        }
                    }

                }
            }
        }
        $caraMasuk = LookupM::getLookupType('inacbgs_caramasuk');
        $COB = PenjaminPasien::getLookupType();

        // var_dump($COB);die;
        $DPJP = PegawaiM::getPegawaiDPJP('1');
        // $model = PendaftaranT::dataListGrouper($nopeserta);
        return Inertia::render('Grouping/indexPasien', [
            'model' => $data,
            'pasien' => $pasien,
            'caraMasuk' => $caraMasuk,
            'DPJP' => $DPJP,
            'COB'=>$COB
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
        $obat = PendaftaranT::getGroupping($pendaftaran_id);
        $profil = ProfilrumahsakitM::getProfilRS();
        $SEP = Inacbg::where('inacbg_nosep', $noSep)->first();
        $serviceGrouping = new groupingService($this->inacbg);
        $getGrouping = $serviceGrouping->callDataGrouping($noSep);
        return response()->json([
            'model' => $getRiwayat,
            'pendaftaran' => $pendaftaran,
            'tarif' => $tarif,
            'obat' => $obat,
            'profil' => $profil,
            'dataDiagnosa' => $dataDiagnosa,
            'dataIcd9cm' => $dataIcd9cm,
            'inacbg'=>$SEP,
            'getGrouping'=>$getGrouping
        ]);
    }
    public function getKlaim($noSep){
        // Ambil keynya dari  ENV 
        $key_ina = env('INACBG_KEY');


        // dd($request->all);
        $nomor_sep = $noSep?? null;

        // Structur Payload 
        $data_ina = [
            'nomor_sep' => $nomor_sep,

        ];


        // result kirim claim
        return $this->inacbg->getClaim($data_ina, $key_ina);
    }
}
