<?php
namespace App\Models\Casemix;

use Carbon\Carbon;
use Exception;
use Http;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class Inacbg extends Model
{
    protected $table = 'inacbg_t';

    public $timestamps = false;
    // PK (Primary Key)
    protected $primaryKey = 'inacbg_id';
    // Attributes
    protected $fillable = [
        'jaminan_id',
        'jaminan_nama',
        'inacbg_nosep',
        'pasien_id',
        'pendaftaran_id',
        'inacbg_tgl',
        'sep_id',
        'kodeinacbg',
        'tarifgruper',
        'totaltarif',
        'total_tarif_rs',
        'adlscore_subaccute',
        'adlscore_chronic',
        'total_lamarawat',
        'is_pasientb',
        'nomor_register_sitb',
        'cara_pulang',
        'caramasuk',
        'ruanganakhir_id',
        'create_time',
        'tarif_prosedur_nonbedah',
        'tarif_prosedur_bedah',
        'tarif_konsultasi',
        'tarif_tenaga_ahli',
        'tarif_keperawatan',
        'tarif_penunjang',
        'tarif_radiologi',
        'tarif_laboratorium',
        'tarif_pelayanan_darah',
        'tarif_rehabilitasi',
        'tarif_akomodasi',
        'tarif_rawat_integerensif',
        'tarif_obat',
        'tarif_obat_kronis',
        'tarif_obat_kemoterapi',
        'tarif_alkes',
        'tarif_bhp',
        'tarif_sewa_alat',
        'cob_id',
        'create_loginpemakai_id',
        'create_ruangan',
        'create_tanggal',
        'create_coder_nik',
        'create_ruangan_id',
        'jenisrawat_inacbg',
        'tglrawat_masuk',
        'tglrawat_keluar',
        'hak_kelasrawat_inacbg',
        'umur_pasien',
        'berat_lahir',
        'adlscore_subaccute',
        'adlscore_chronic',
        'nama_dpjp',
        'cara_pulang',
        'no_reg_sitb',
        'sistole',
        'diastole',
        'update_time',
        'update_loginpemakai_id',
        'pegfinalisasi_id',
        'is_finalisasi',
        'tglfinalisasi'
    ];

    protected $casts = [
        'tarif_prosedur_nonbedah' => 'float',
        'tarif_prosedur_bedah' => 'float',
        'tarif_konsultasi' => 'float',
        'tarif_tenaga_ahli' => 'float',
        'tarif_keperawatan' => 'float',
        'tarif_penunjang' => 'float',
        'tarif_radiologi' => 'float',
        'tarif_laboratorium' => 'float',
        'tarif_pelayanan_darah' => 'float',
        'tarif_rehabilitasi' => 'float',
        'tarif_akomodasi' => 'float',
        'tarif_rawat_integerensif' => 'float',
        'tarif_obat' => 'float',
        'tarif_obat_kronis' => 'float',
        'tarif_obat_kemoterapi' => 'float',
        'tarif_alkes' => 'float',
        'tarif_bhp' => 'float',
        'tarif_sewa_alat' => 'float',
        'is_pasientb' => 'boolean',
    ];
    
    /**
     * get data from dashboard
     */
    public static function getDashboard()
    {
        return DB::table('inacbg_t')
            ->selectRaw('SUM(total_tarif_rs) as total_tarif_rs, SUM(tarifgruper) as tarifgruper, count(total_tarif_rs) as count_total')
            ->whereBetween('inacbg_tgl', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
            ->first();
    }
    /**
     * Hitung total item untuk pagination.
     */
    public static function getTotalItems(): int
    {
        return DB::table('inacbg_t')
            ->leftJoin('pendaftaran_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('sep_t', 'inacbg_t.sep_id', '=', 'sep_t.sep_id')
            ->leftJoin('pasien_m', 'inacbg_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->leftJoin('loginpemakai_k', 'inacbg_t.create_loginpemakai_id', '=', 'loginpemakai_k.loginpemakai_id')
            ->leftJoin('pegawai_m', 'loginpemakai_k.pegawai_id', '=', 'pegawai_m.pegawai_id')
            ->count();
    }

    /**
     * Ambil data untuk ditampilkan dengan pagination.
     */
    public static function getPaginatedData(int $limit, int $offset)
    {
        return DB::table('inacbg_t')
            ->select([
                'pasien_m.nama_pasien',
                'pasien_m.no_rekam_medik',
                'pendaftaran_t.no_pendaftaran',
                'sep_t.nosep',
                'inacbg_t.tglrawat_masuk',
                'inacbg_t.tglrawat_keluar',
                'inacbg_t.jaminan_nama',
                'inacbg_t.is_terkirim',
            ])
            ->leftJoin('pendaftaran_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('sep_t', 'inacbg_t.sep_id', '=', 'sep_t.sep_id')
            ->leftJoin('pasien_m', 'inacbg_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->leftJoin('loginpemakai_k', 'inacbg_t.create_loginpemakai_id', '=', 'loginpemakai_k.loginpemakai_id')
            ->leftJoin('pegawai_m', 'loginpemakai_k.pegawai_id', '=', 'pegawai_m.pegawai_id')
            ->offset($offset)
            ->limit($limit)
            ->get();
    }
    public static function dataListKirimOnlineCount(array $filters = [])
    {
        $query =DB::table('informasisepgrouping_v');
        if (!empty($filters['date_type']) && $filters['date_type'] == '1') {
            $query->where('tgl_pulang', '=', $filters['start_dt'] );
        }else{
            $query->where('inacbg_tgl', '=', $filters['start_dt'] );
        }
        if (!empty($filters['jenis_rawat']) && $filters['jenis_rawat'] != '3') {
            $query->where('jnspelayanan', '=', $filters['jenis_rawat'] );
        }
        $query->whereRaw('(is_finalisasi = true)');
        return $query->count();
    }
    /**
     * Ambil data untuk ditampilkan dengan pagination.
     */
    public static function dataListKirimOnline(int $limit, int $offset, array $filters = [])
    {
        $query =DB::table('informasisepgrouping_v');
        if (!empty($filters['date_type']) && $filters['date_type'] == '1') {
            $query->where('tgl_pulang', '=', $filters['start_dt'] );
        }else{
            $query->where('inacbg_tgl', '=', $filters['start_dt'] );
        }
        if (!empty($filters['jenis_rawat']) && $filters['jenis_rawat'] != '3') {
            $query->where('jnspelayanan', '=', $filters['jenis_rawat'] );
        }
        $query->whereRaw('(is_finalisasi = true)');
        $query->offset($offset);
        $query->limit($limit);

        return $query->get();
    }
    /**
     * Summary of inacbg_encrypt
     * @param mixed $data
     * @param mixed $key
     * @throws \Exception
     * @return string
     * This is Function To Encryption The Payload
     */
    public function inacbg_encrypt($data, $key)
    {
        /// make binary representasion of $key
        $key = hex2bin($key);
        /// check key length, must be 256 bit or 32 bytes
        if (mb_strlen($key, "8bit") !== 32) {
            throw new Exception("Needs a 256-bit key!");
        }
        /// create initialization vector
        $iv_size = openssl_cipher_iv_length("aes-256-cbc");
        $iv = openssl_random_pseudo_bytes($iv_size); // dengan catatan dibawah
        // $iv = random_bytes($iv_size); // dengan catatan dibawah
        /// encrypt
        $encrypted = openssl_encrypt($data, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv);
        /// create signature, against padding oracle attacks
        $signature = mb_substr(hash_hmac("sha256", $encrypted, $key, true), 0, 10, "8bit");
        /// combine all, encode, and format
        $encoded = chunk_split(base64_encode($signature . $iv . $encrypted));
        return $encoded;
    }
    //end encrypt


    /**
     * Summary of inacbg_compare
     * @param mixed $a
     * @param mixed $b
     * @return bool
     * Function Validation for compare  signature
     */
    public function inacbg_compare($a, $b)
    {
        /// compare individually to prevent timing attacks
        /// compare length
        if (strlen($a) !== strlen($b))
            return false;
        /// compare individual
        $result = 0;
        for ($i = 0; $i < strlen($a); $i++) {
            $result |= ord($a[$i]) ^ ord($b[$i]);
        }
        return $result == 0;
    }


    /**
     * Summary of inacbg_decrypt
     * @param mixed $str
     * @param mixed $strkey
     * @throws \Exception
     * @return bool|string
     * Function For decryption  Encryption
     */
    public function inacbg_decrypt($str, $strkey)
    {
        /// make binary representation of $key
        $key = hex2bin($strkey);
        /// check key length, must be 256 bit or 32 bytes
        if (mb_strlen($key, "8bit") !== 32) {
            throw new Exception("Needs a 256-bit key!");
        }
        /// calculate iv size
        $iv_size = openssl_cipher_iv_length("aes-256-cbc");
        /// breakdown parts
        $decoded = base64_decode($str);
        $signature = mb_substr($decoded, 0, 10, "8bit");
        $iv = mb_substr($decoded, 10, $iv_size, "8bit");
        $encrypted = mb_substr($decoded, $iv_size + 10, NULL, "8bit");
        /// check signature, against padding oracle attack
        $calc_signature = mb_substr(hash_hmac("sha256", $encrypted, $key, true), 0, 10, "8bit");
        if (!$this->inacbg_compare($signature, $calc_signature)) {
            return "SIGNATURE_NOT_MATCH"; /// signature doesn't match
        }
        $decrypted = openssl_decrypt($encrypted, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv);
        return $decrypted;
    }

    /**
     * Summary of validateData
     * @param array $data
     * @throws \Exception
     * @return void
     * Validasi Untuk Data Request Apakah Sudah Valid Atau Tidak
     */
    public function validateData(array $data)
    {
        $validator = Validator::make($data, [
            'nomor_kartu' => 'required|string',
            'nomor_sep' => 'required|string',
            'nomor_rm' => 'required|string',
            'nama_pasien' => 'required|string',
            'tgl_lahir' => 'required',
            'gender' => 'required',
        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }


    public function validateDataPrint(array $data)
    {
        $validator = Validator::make($data, [
            'nomor_sep' => 'required|string'
        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }



    public function validateDataKlaimUpdate(array $data)
    {
        $validator = Validator::make($data, [
            'nomor_kartu' => 'required|string',
            'nomor_sep' => 'required|string',
            'tgl_pulang' => 'required',
            'tgl_masuk' => 'required',
            'jenis_rawat' => 'required',
            'kelas_rawat' => 'required',
            'coder_nik' => 'required',
            'diagnosa' => 'required'
        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }


    /**
     * Summary of validateData
     * @param array $data
     * @throws \Exception
     * @return void
     * Validasi Untuk Data Request Apakah Sudah Valid Atau Tidak
     */
    public function validateGroupingSatu(array $data)
    {
        $validator = Validator::make($data, [
            'nomor_sep' => 'required|string'
        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }

    public function validatereeditKlaim(array $data)
    {
        $validator = Validator::make($data, [
            'nomor_sep' => 'required|string',

        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }

    public function validateSendKlaim(array $data)
    {
        $validator = Validator::make($data, [
            'nomor_sep' => 'required|string',
            'coder_nik' => 'required|string'

        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }




    /**
     * Summary of validateDataDiagnosisParameter
     * @param array $data
     * @throws \Exception
     * @return void
     * Validasi Untuk Data Request Apakah Sudah Valid Atau Tidak
     */
    public function validateDataDiagnosisParameter(array $data)
    {
        $validator = Validator::make($data, [
            'keyword' => 'required',
        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }


    /**
     * Summary of validateDataProceduralParameter
     * @param array $data
     * @throws \Exception
     * @return void
     */
    public function validateDataProceduralParameter(array $data)
    {
        $validator = Validator::make($data, [
            'keyword' => 'required',
        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }
    /**
     * Summary of newClaim
     * @param array $data  This is request data 
     * @param string $key $this is for the key from iancbg
     * @return array
     * This function for Send New Claim 
     */
    public function newClaim(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateData($data);
            $payload = $this->preparePayloadNewKlaim($data);
            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            // echo "<pre>";
            // var_dump($e);die;
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    public function generate_claim_number(array $data, string $key): array
    {
        try {
            // validate The Payload
            // $this->validateData($data);
            $payload = $this->preparePayloadGenerateClaim($data);
            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Summary of newClaim
     * @param array $data  This is request data 
     * @param string $key $this is for the key from iancbg
     * @return array
     * This function for Send New Claim 
     */
    public function deleteKlaim(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateSendKlaim($data);
            $payload = $this->preparePayloadDeletedClaim($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            // echo "<pre>";
            // var_dump($e);die;
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }



    public function printKlaim(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateDataPrint($data);
            $payload = $this->preparePayloadPrintklaim($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponsePrint($response, $key);
        } catch (Exception $e) {
            // echo "<pre>";
            // var_dump($e);die;
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }


    /**
     * Summary of updateDataKlaim
     * @param array $data
     * @param string $key
     * @return array
     * 
     * This is Function For Update or set data Klaim
     */
    public function updateDataKlaim(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateDataKlaimUpdate($data);
            $payload = $this->preparePayloadUpdateKlaim($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponseDataKlaim($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }


    /**
     * Summary of updateDataKlaim
     * @param array $data
     * @param string $key
     * @return array
     * 
     * This is Function For Update or set data Klaim
     */
    public function groupingStageSatu(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateGroupingSatu($data);
            $payload = $this->preparePayloadGroupingStageSatu($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponseStage1($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }



    public function kirimOnlineKlaim(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validatereeditKlaim(data: $data);
            $payload = $this->preparePayloadKirimIndividuClaim($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }


    public function reeditclaim(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validatereeditKlaim($data);
            $payload = $this->preparePayloadReeditClaim($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    public function sendClaimKolektif(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateSendClaimKolektif($data);
            $payload = $this->preparePayloadClaimKolektif($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key
            $response = $this->sendRequest($encryptedPayload, $key);
            dd($response);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    public function validateSendClaimKolektif(array $data)
    {
        $validator = Validator::make($data, [
            'start_dt' => 'required',
            'stop_dt' => 'required',
            'jenis_rawat' => 'required',
            'date_type' => 'required',

        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }
    private function preparePayloadClaimKolektif(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'send_claim'],
            'data' => [
                'start_dt' => $data['start_dt'] ?? "",
                'stop_dt' => $data['stop_dt'] ?? "",
                'jenis_rawat' => $data['jenis_rawat'] ?? "",
                'date_type' => $data['date_type'] ?? ""
            ],
        ]);
    }
    public function finalisasi(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateSendKlaim($data);
            $payload = $this->preparePayloadSendFinalisasi($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            // dd($response);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    /**
     * Summary of searchDiagnosa
     * @param array $data
     * @param string $key
     * @return array
     */
    public function searchDiagnosa(array $data, string $key)
    {
        try {
            // var_dump($key);die;
            // validate The Payload
            $this->validateDataDiagnosisParameter($data);
            $payload = $this->preparePayloadSearchDiagnosa($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            // var_dump($encryptedPayload);die; 

            $response = $this->sendRequest($encryptedPayload, $key);

            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }


    /**
     * Summary of searchProcedural
     * @param array $data
     * @param string $key
     * @return array
     */
    public function searchProcedural(array $data, string $key)
    {
        try {
            // var_dump($key);die;
            // validate The Payload
            $this->validateDataProceduralParameter($data);
            $payload = $this->preparePayloadSearchProcedural($data);

            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            // var_dump($encryptedPayload);die; 

            $response = $this->sendRequest($encryptedPayload, $key);

            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Summary of preparePayloadNewKlaim
     * @param array $data
     * @return string
     * This Is Function For Prepare The payload after Validation the Request Already Valid
     */
    private function preparePayloadNewKlaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'new_claim'],
            'data' => [
                'nomor_kartu' => $data['nomor_kartu'] ?? null,
                'nomor_sep' => $data['nomor_sep'] ?? null,
                'nomor_rm' => $data['nomor_rm'] ?? null,
                'nama_pasien' => $data['nama_pasien'] ?? null,
                'tgl_lahir' => $data['tgl_lahir'] ?? null,
                'gender' => $data['gender'] ?? null,
            ],
        ]);
    }

    private function preparePayloadGenerateClaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'generate_claim_number','payor_id' => 3],
        ]);
    }

       /**
     * Summary of preparePayload Delete Klaim
     * @param array $data
     * @return string
     * This Is Function For Prepare The payload after Validation the Request Already Valid
     */
    private function preparePayloadDeletedClaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'delete_claim'],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? null,
                'coder_nik' => $data['coder_nik'] ?? null,
            ],
        ]);
    }


    /**
     * Summary of preparePayloadPrintklaim
     * @param array $data
     * @return string
     * This Is Function For Prepare The payload after Validation the Request Already Valid
     */
    private function preparePayloadPrintklaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'claim_print'],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? null
            ],
        ]);
    }


    private function preparePayloadUpdateKlaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'set_claim_data', 'nomor_sep' => $data['nomor_sep'] ?? null],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? "",
                'nomor_kartu' => $data['nomor_kartu'] ?? "",
                'tgl_masuk' => $data['tgl_masuk'] ?? "",
                'cara_masuk' => $data['cara_masuk'] ?? "",
                'tgl_pulang' => $data['tgl_pulang'] ?? "",
                'jenis_rawat' => $data['jenis_rawat'] ?? "",
                'kelas_rawat' => $data['kelas_rawat'] ?? "",
                'adl_sub_acute' => $data['adl_sub_acute'] ?? "",
                'adl_chronic' => $data['adl_chronic'] ?? "",
                'icu_indikator' => $data['icu_indikator'] ?? null,
                'icu_los' => $data['icu_los'] ?? null,
                'ventilator_hour' => $data['ventilator_hour'] ?? null,
                'upgrade_class_ind' => $data['upgrade_class_ind'] ?? null,
                'upgrade_class_class' => $data['upgrade_class_class'] ?? null,
                'upgrade_class_los' => $data['upgrade_class_los'] ?? null,
                'upgrade_class_payor' => $data['upgrade_class_payor'] ?? null,
                'birth_weight' => $data['birth_weight'] ?? null,
                'sistole' => $data['sistole'] ?? null,
                'diastole' => $data['diastole'] ?? null,
                'discharge_status' => $data['discharge_status'] ?? null,
                'diagnosa' => $data['diagnosa'] ?? null,
                'diagnosa_inagrouper' => $data['diagnosa_inagrouper'] ?? null,
                'procedure' => $data['procedure'] ?? null,
                'procedure_inagrouper' => $data['procedure_inagrouper'] ?? null,
                'tarif_rs' => [
                    'prosedur_non_bedah' => $data['prosedur_non_bedah'] ?? null,
                    'prosedur_bedah' => $data['prosedur_bedah'] ?? null,
                    'konsultasi' => $data['konsultasi'] ?? null,
                    'tenaga_ahli' => $data['tenaga_ahli'] ?? null,
                    'keperawatan' => $data['keperawatan'] ?? null,
                    'penunjang' => $data['penunjang'] ?? null,
                    'radiologi' => $data['radiologi'] ?? null,
                    'laboratorium' => $data['laboratorium'] ?? null,
                    'pelayanan_darah' => $data['pelayanan_darah'] ?? null,
                    'rehabilitasi' => $data['rehabilitasi'] ?? null,
                    'kamar' => $data['kamar'] ?? null,
                    'rawat_intensif' => $data['rawat_intensif'] ?? null,
                    'obat' => $data['obat'] ?? null,
                    'obat_kronis' => $data['obat_kronis'] ?? null,
                    'obat_kemoterapi' => $data['obat_kemoterapi'] ?? null,
                    'alkes' => $data['alkes'] ?? null,
                    'bmhp' => $data['bmhp'] ?? null,
                    'sewa_alat' => $data['sewa_alat'] ?? null,

                ],
                'tarif_poli_eks' => $data['tarif_poli_eks'] ?? null,
                'nama_dokter' => $data['nama_dokter'] ?? null,
                'kode_tarif' => $data['kode_tarif'] ?? null,
                'payor_id' => $data['payor_id'] ?? null,
                'payor_cd' => $data['payor_cd'] ?? null,
                'cob_cd' => $data['cob_cd'] ?? null,
                'coder_nik' => $data['coder_nik'] ?? null,
            ],
        ]);
    }


    private function preparePayloadGroupingStageSatu(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'grouper', 'stage' => 1],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? ""
            ],
        ]);
    }


    private function preparePayloadKirimIndividuClaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'send_claim_invidual'],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? ""

            ],
        ]);
    }

    private function preparePayloadReeditClaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'reedit_claim'],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? ""

            ],
        ]);
    }

    private function preparePayloadSendFinalisasi(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'claim_final'],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? "",
                'coder_nik' => $data['coder_nik'] ?? ""

            ],
        ]);
    }

    /**
     * Summary of preparePayloadSearchDiagnosa
     * @param array $data
     * @return string
     * For search Diagnosis Payload
     */
    private function preparePayloadSearchDiagnosa(array $data): string
    {
        // var_dump($data['keyword']);die;
        return json_encode([
            'metadata' => ['method' => 'search_diagnosis'],
            'data' => [
                'keyword' => $data['keyword'] ?? null,
            ],
        ]);
    }


    /**
     * Summary of preparePayloadSearchProcedural
     * @param array $data
     * @return string
     */
    private function preparePayloadSearchProcedural(array $data): string
    {
        // var_dump($data['keyword']);die;
        return json_encode([
            'metadata' => ['method' => 'search_procedures'],
            'data' => [
                'keyword' => $data['keyword'] ?? null,
            ],
        ]);
    }

    public function validateDataClaim(array $data)
    {
        $validator = Validator::make($data, [
            'nomor_sep' => 'required|string'
        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }


    public function validateTB(array $data)
    {
        $validator = Validator::make($data, [
            'no_sep' => 'required|string',
            'nomor_register_sitb' => 'required|string'
        ]);

        if ($validator->fails()) {
            throw new Exception(implode(', ', $validator->errors()->all()));
        }
    }
    private function preparePayloadGetClaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'get_claim_data'],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? "",
            ],
        ]);
    }


    private function preparePayloadGetSITB(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'sitb_validate'],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? "",
                'nomor_register_sitb'=>$data['nomor_register_sitb'] ?? "",
            ],
        ]);
    }
    
    /**
     * Summary of getClaim
     * @param array $data
     * @return string
     * get claim from nomor_sep
     */
    public function getClaim(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateDataClaim($data);
            $payload = $this->preparePayloadGetClaim($data);
 
            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }


    /**
     * Summary of getClaim
     * @param array $data
     * @return string
     * get claim from nomor_sep
     */
    public function validateSITB(array $data, string $key): array
    {
        try {
            // validate The Payload
            $this->validateTB($data);
            $payload = $this->preparePayloadGetSITB($data);
 
            $encryptedPayload = $this->inacbg_encrypt($payload, $key); // Tambahkan parameter $key

            $response = $this->sendRequest($encryptedPayload, $key);
            return $this->processResponse($response, $key);
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    /**
     * Summary of sendRequest
     * @param string $encryptedPayload
     * @param string $key
     * @throws \Exception
     * @return string
     * This is Send Request Function 
     */
    private function sendRequest(string $encryptedPayload, string $key): string
    {
        // Prepare the request URL and headers
        $url = env('INACBG_URL');
        ; // Assuming $this->url is already set on ENV
        $header = array("Content-Type: application/x-www-form-urlencoded");

        // Initialize cURL session
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);  // Don't include the header in the response
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  // Return the response as a string
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_POST, 1);  // Use POST method
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encryptedPayload);  // Attach the encrypted payload

        // Execute the cURL request
        $response = curl_exec($ch);

        // Check for errors
        if (curl_errno($ch)) {
            throw new Exception('Curl error: ' . curl_error($ch));
        }

        // Close cURL session
        curl_close($ch);

        // Clean up the response by removing headers
        $first = strpos($response, "\n") + 1;
        $last = strrpos($response, "\n") - 1;
        $response = substr($response, $first, strlen($response) - $first - $last);

        $response = $this->inacbg_decrypt($response, $key);


        // Optionally: You can return the raw response or decrypt it as needed here
        // For now, we are returning the raw response.
        return $response;
    }


    /**
     * Summary of processResponse
     * @param string $response
     * @param string $key
     * @return array
     * Display Response 
     */
    private function processResponse(string $response, string $key): array
    {
        $decodedResponse = json_decode($response, true);

        // echo "<pre>";
        // var_dump($decodedResponse);die;
        if ($decodedResponse['metadata']['code'] == 200) {
            return [
                'success' => true,
                'message' => $decodedResponse['metadata']['message'],
                'data' => $decodedResponse['response'] ?? null,
            ];
        }

        return [
            'success' => false,
            'message' => $decodedResponse['metadata']['message'] ?? 'Unknown error',
        ];
    }

    private function processResponseStage1(string $response, string $key): array
    {
        $decodedResponse = json_decode($response, true);
        // echo "<pre>";
        // var_dump($decodedResponse);die;
        if ($decodedResponse['metadata']['code'] == 200) {
            return [
                'success' => true,
                'message' => $decodedResponse['metadata']['message'],
                'data' => $decodedResponse ?? null,
            ];

        }

        return [
            'success' => false,
            'message' => $decodedResponse['metadata']['message'] ?? 'Unknown error',
        ];
    }
    
    private function processResponsePrint(string $response, string $key): array
    {
        $decodedResponse = json_decode($response, true);

        // echo "<pre>";
        // var_dump($decodedResponse['data']);die;
        if ($decodedResponse['metadata']['code'] == 200) {
            return [
                'success' => true,
                'message' => $decodedResponse['metadata']['message'],
                'data' => $decodedResponse['data'] ?? null,
            ];
        }

        return [
            'success' => false,
            'message' => $decodedResponse['metadata']['message'] ?? 'Unknown error',
        ];
    }



    private function processResponseDataKlaim(string $response, string $key): array
    {
        $decodedResponse = json_decode($response, true);

        // echo "<pre>";
        // var_dump($decodedResponse);die;
        if ($decodedResponse['metadata']['code'] == 200) {
            return [
                'success' => true,
                'message' => $decodedResponse['metadata']['message'],
            ];
        }

        return [
            'success' => false,
            'message' => $decodedResponse['metadata']['message'] ?? 'Unknown error',
        ];
    }




    public static function reportClaimReceivables(int $limit, int $offset, array $filters = [])
    {
        $query = DB::table('inacbg_t')
            ->select([
                'inacbg_t.inacbg_id',
                'inacbg_t.inacbg_nosep AS nosep',
                DB::raw('DATE(inacbg_t.tglrawat_masuk) AS tglrawat_masuk'),
                DB::raw('DATE(inacbg_t.tglrawat_keluar) AS tglrawat_keluar'),
                'inacbg_t.total_tarif_rs',
                'inacbg_t.tarifgruper',
                'pendaftaran_t.no_pendaftaran',
                DB::raw("CASE WHEN sep_t.jnspelayanan = 1 THEN 'RI' ELSE 'RJ' END AS jenispelayanan"),
                'sep_t.nokartuasuransi',
                'sep_t.dpjpygmelayani_nama',
                'pasien_m.nama_pasien',
                DB::raw("COALESCE(ruangan_m1.ruangan_nama, ruangan_m.ruangan_nama) AS ruangan_nama"),
                DB::raw("STRING_AGG(DISTINCT CONCAT_WS(',', inasiscmg_t.kode_spesialprosedure, inasiscmg_t.kode_spesialprosthesis, inasiscmg_t.kode_spesialinvestigation, inasiscmg_t.kode_spesialdrug), ',') AS topup"),
            ])
            ->join('pendaftaran_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->join('sep_t', 'sep_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->join('pasien_m', 'inacbg_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->leftJoin('ruangan_m', 'ruangan_m.ruangan_id', '=', 'pendaftaran_t.ruangan_id')
            ->leftJoin('ruangan_m AS ruangan_m1', 'ruangan_m1.ruangan_id', '=', 'pendaftaran_t.ruangan_id')
            ->leftJoin('inasiscmg_t', 'inacbg_t.inacbg_id', '=', 'inasiscmg_t.inacbg_id')
            ->groupBy([
                'inacbg_t.inacbg_id',
                'pendaftaran_t.no_pendaftaran',
                'sep_t.jnspelayanan',
                'sep_t.nokartuasuransi',
                'sep_t.dpjpygmelayani_nama',
                'pasien_m.nama_pasien',
                'ruangan_m.ruangan_nama',
                'ruangan_m1.ruangan_nama',
            ]);

        self::applyFilters($query, $filters);

        return $query->offset($offset)->limit($limit)->get();
    }

    public static function reportCountClaimReceivables(array $filters = [])
    {
        $query = DB::table('inacbg_t')
            ->join('pendaftaran_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->join('sep_t', 'sep_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->join('pasien_m', 'inacbg_t.pasien_id', '=', 'pasien_m.pasien_id');

        self::applyFilters($query, $filters);

        return $query->count();
    }


    private static function applyFilters($query, array $filters)
    {
        foreach ($filters as $key => $value) {
            if (!empty($value)) {
                // var_dump($value);die;
                if ($key === 'query') {
                    $query->where(function ($q) use ($value) {
                        $q->where('nama_pasien', 'like', "%$value%")
                            ->orWhere('nosep', 'like', "%$value%")
                            ->orWhere('no_rekam_medik', 'like', "%$value%");
                    });
                } else {
                    $query->where($key, $key === 'nama_pasien' ? 'like' : '=', $key === 'nama_pasien' ? "%$value%" : $value);
                }
            }
        }

    }

    public static function dataListSep(int $limit, int $offset, array $filters = [])
    {


        $query1 = self::buildBaseQuery();
        if (!empty($filters)) {
            if (!empty($filters['periode']) || !empty($filters['kelasRawat']) || !empty($filters['jenisrawat'])) {
                if ($filters['periode'] == 'tanggal_pulang') {
                    $query1->whereBetween(
                        DB::raw('DATE(pas.tglpulang)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } else if ($filters['periode'] == 'tanggal_masuk') {
                    $query1->whereBetween(
                        DB::raw('DATE(tglmasuk)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } else if ($filters['kelasRawat'] == 'hakkelas_kode') {
                    $query1->where('hakkelas_kode', '=', $filters['kelasRawat']);

                } else if ($filters['jenisrawat'] == 'jenisrawat') {
                    $query1->where('hakkelas_kode', '=', $filters['kelasRawat']);

                }
            } else {
                if (isset($filters['query'])) {
                    $value = $filters['query'];
                    $query1->whereRaw('LOWER(pa.nama_pasien) LIKE ?', ['%' . strtolower($value) . '%'])
                        ->orWhereRaw('(s.nosep) LIKE ?', ['%' . ($value) . '%'])
                        ->orWhereRaw('(pa.no_rekam_medik) LIKE ?', ['%' . ($value) . '%']);
                    $query1->orderBy('pa.nama_pasien','asc');
                }
            }
        }
        return $query1
            ->limit($limit)
            ->offset($offset)
            ->get();
    }

    public static function dataListSepCount(array $filters = [])
    {
        $query1 = self::buildBaseQuery();

        // Terapkan filter pada kedua query
        // self::applyFilters($query1, $filters);
        // self::applyFilters($query2, $filters);

        if (!empty($filters)) {
            if (!empty($filters['periode']) || !empty($filters['kelasRawat']) || !empty($filters['jenisrawat'])) {
                if ($filters['periode'] == 'tanggal_pulang') {
                    $query1->whereBetween(
                        DB::raw('DATE(pas.tglpulang)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } else if ($filters['periode'] == 'tanggal_masuk') {
                    $query1->whereBetween(
                        DB::raw('DATE(tglmasuk)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } else if ($filters['kelasRawat'] == 'hakkelas_kode') {
                    $query1->where('s.klsrawat', '=', $filters['kelasRawat']);

                } else if ($filters['jenisrawat'] == 'jenisrawat') {
                    $query1->where('s.hakkelas_kode', '=', $filters['kelasRawat']);

                }
            } else {
                if (isset($filters['query'])) {
                    $value = $filters['query'];
                    $query1->whereRaw('LOWER(pa.nama_pasien) LIKE ?', ['%' . strtolower($value) . '%'])
                        ->orWhereRaw('(s.nosep) LIKE ?', ['%' . ($value) . '%'])
                        ->orWhereRaw('(pa.no_rekam_medik) LIKE ?', ['%' . ($value) . '%']);
                }
            }
        }

        // Hitung total data dari kedua query
        return $query1->count();
    }

    // private static function buildBaseQuery(bool $isSecondQuery = false)
    // {
    //     $query = DB::table('pendaftaran_t as p')
    //         ->leftJoin('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
    //         ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')         
    //         ->join('asuransipasien_m as ap', 'ap.asuransipasien_id', '=', 'p.asuransipasien_id')
    //         ->select(
    //             'pa.nama_pasien',
    //             's.nosep',
    //             'ap.nopeserta',
    //             'pa.tanggal_lahir',
    //             DB::raw("concat(DATE_PART('year', age(tanggal_lahir)), ' Tahun')"),
    //         );


    //         dd($query->toSql());
    //     return $query;
    // }

    // private static function buildBaseQuery(bool $isSecondQuery = false)
    // {
    //     $query = DB::table('pendaftaran_t as p')
    //         ->join('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
    //         ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')

    //         ->leftJoin('pasienadmisi_t as pas', 'pas.pasienadmisi_id', '=', 'p.pasienadmisi_id')
    //         ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 's.sep_id')
    //         ->leftJoin('pasienpulang_t', 'p.pasienpulang_id', '=', 'pasienpulang_t.pasienpulang_id')
    //         ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
    //         ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
    //         ->leftJoin('asuransipasien_m as ap', 'ap.asuransipasien_id', '=', 'p.asuransipasien_id')
    //         ->select(
    //             DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.tgladmisi ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglmasuk'),
    //             DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.rencanapulang ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglpulang'),
    //             'pa.nama_pasien',
    //             's.nosep',
    //             DB::raw("'JKN'::text AS jaminan"),
    //             DB::raw("
    //             CASE
    //                 WHEN inacbg_t.tglrawat_masuk IS NOT NULL THEN DATE(inacbg_t.tglrawat_masuk)
    //                 WHEN inacbg_t.tglrawat_masuk IS NULL AND p.pasienadmisi_id IS NULL THEN DATE(p.tgl_pendaftaran)
    //                 WHEN inacbg_t.tglrawat_masuk IS NULL AND p.pasienadmisi_id IS NOT NULL THEN DATE(pas.tgladmisi)
    //                 ELSE DATE(p.tgl_pendaftaran)
    //             END AS tanggalmasuk_inacbg,
    //             CASE
    //                 WHEN inacbg_t.tglrawat_keluar IS NOT NULL THEN DATE(inacbg_t.tglrawat_keluar)
    //                 WHEN inacbg_t.tglrawat_keluar IS NULL AND p.pasienpulang_id IS NOT NULL THEN DATE(pasienpulang_t.tglpasienpulang)
    //                 WHEN inacbg_t.tglrawat_keluar IS NULL THEN DATE(p.tgl_pendaftaran)
    //                 ELSE DATE(p.tgl_pendaftaran)
    //             END AS tanggalpulang_inacbg
    //         "),
    //             DB::raw("CASE WHEN s.jnspelayanan = 2 THEN 'RJ' WHEN s.jnspelayanan = 1 THEN 'RI' ELSE '?' END AS tipe"),
    //             'inasiscbg_t.kodeprosedur as cbg',
    //             DB::raw("CASE 
    //             WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim' 
    //             WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN 'Final' 
    //             WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN '-' 
    //             ELSE '-' 
    //         END AS status"),
    //             'ap.nopeserta',
    //             'pa.tanggal_lahir',
    //             DB::raw("concat(DATE_PART('year', age(tanggal_lahir)), ' Tahun')"),
    //             'pg.nama_pegawai'
    //         );


    //     return $query;
    // }

    private static function buildBaseQuery(bool $isSecondQuery = false)
    {
        $query = DB::table('sep_t as s')
            ->join('pendaftaran_t as p', 'p.sep_id', '=', 's.sep_id')
            ->join('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
            ->select('pa.nama_pasien', 'pa.tanggal_lahir','pa.jeniskelamin','pa.no_rekam_medik', 's.nokartuasuransi as nopeserta')
            ->groupBy('pa.nama_pasien','pa.tanggal_lahir','pa.jeniskelamin', 'pa.no_rekam_medik', 's.nokartuasuransi')
            ->orderBy('pa.nama_pasien', 'asc')
            ;

        return $query;
    }


}
