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
            $this->validateData($data);
            $payload = $this->preparePayloadUpdateKlaim($data);

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


    private function preparePayloadUpdateKlaim(array $data): string
    {
        return json_encode([
            'metadata' => ['method' => 'set_claim_data', 'nomor_sep' => $data['nomor_sep'] ?? null],
            'data' => [
                'nomor_sep' => $data['nomor_sep'] ?? null,
                'nomor_kartu' => $data['nomor_kartu'] ?? null,
                'tgl_masuk' => $data['tgl_masuk'] ?? null,
                'tgl_pulang' => $data['tgl_pulang'] ?? null,
                'jenis_rawat' => $data['jenis_rawat'] ?? null,
                'kelas_rawat' => $data['kelas_rawat'] ?? null,
                'adl_sub_acute' => $data['adl_sub_acute'] ?? null,
                'adl_chronic' => $data['adl_chronic'] ?? null,
                'icu_indikator' => $data['icu_indikator'] ?? null,
                'icu_los' => $data['icu_los'] ?? null,
                'ventilator_hour' => $data['ventilator_hour'] ?? null,
                'upgrade_class_ind' => $data['upgrade_class_ind'] ?? null,
                'upgrade_class_class' => $data['upgrade_class_class'] ?? null,
                'upgrade_class_los' => $data['upgrade_class_los'] ?? null,
                'birth_weight' => $data['birth_weight'] ?? null,
                'discharge_status' => $data['discharge_status'] ?? null,
                'diagnosa' => $data['diagnosa'] ?? null,
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

        // var_dump($decodedResponse['response']['data']);die;
        if ($decodedResponse['metadata']['code'] == 200) {
            return [
                'success' => true,
                'message' => $decodedResponse['response']['message'],
                'data' => $decodedResponse['response']['data'] ?? null,
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
                $query->where($key, $key === 'nama_pasien' ? 'like' : '=', $key === 'nama_pasien' ? "%$value%" : $value);
            }
        }
    }

    public static function dataListSep(int $limit, int $offset, array $filters = [])
    {
        $query1 = DB::table('pendaftaran_t as p')
            ->join('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
            ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')
            ->leftJoin('pasienadmisi_t as pas', 'pas.pasienadmisi_id', '=', 'p.pasienadmisi_id')
            ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 's.sep_id')
            ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
            ->leftJoin('asuransipasien_m as ap', 'ap.asuransipasien_id', '=', 'p.asuransipasien_id')
            ->select(DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.tgladmisi ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglmasuk'),
            DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.rencanapulang ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglpulang'),
            'pa.nama_pasien',
            's.nosep',
            DB::raw("'JKN'::text AS jaminan"),
            DB::raw('CASE WHEN s.jnspelayanan = 2 THEN \'RJ\' WHEN s.jnspelayanan = 1 THEN \'RI\' ELSE \'?\' END AS tipe'),
            'inasiscbg_t.kodeprosedur as cbg',
            DB::raw('CASE WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN \'Terkirim\' WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN \'Final\' WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN \'-\' ELSE \'-\' END AS status'),
            'ap.nopeserta',
            'pa.tanggal_lahir',
            DB::raw('concat(DATE_PART(\'year\', age(tanggal_lahir)), \' Tahun\')'),
            'pg.nama_pegawai');
    
        $query2 = DB::table('pendaftaran_t as p')
            ->join('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
            ->leftJoin('pasienadmisi_t as pas', 'pas.pasienadmisi_id', '=', 'p.pasienadmisi_id')
            ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')
            ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 's.sep_id')
            ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
            ->leftJoin('asuransipasien_m as ap', 'ap.asuransipasien_id', '=', 'p.asuransipasien_id')
            ->select(DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.tgladmisi ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglmasuk'),
            DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.rencanapulang ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglpulang'),
            'pa.nama_pasien',
            's.nosep',
            DB::raw("'JKN'::text AS jaminan"),
            DB::raw('CASE WHEN s.jnspelayanan = 2 THEN \'RJ\' WHEN s.jnspelayanan = 1 THEN \'RI\' ELSE \'?\' END AS tipe'),
            'inasiscbg_t.kodeprosedur as cbg',
            DB::raw('CASE WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN \'Terkirim\' WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN \'Final\' WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN \'-\' ELSE \'-\' END AS status'),
            'ap.nopeserta',
            'pa.tanggal_lahir',
            DB::raw('concat(DATE_PART(\'year\', age(tanggal_lahir)), \' Tahun\')'),
            'pg.nama_pegawai');
    
        // Terapkan filter pada kedua query
        self::applyFilters($query1, $filters);
        self::applyFilters($query2, $filters);
    
        // Gabungkan query menggunakan UNION ALL, lalu tambahkan limit dan offset
        $result = $query1->unionAll($query2)
            ->limit($limit)
            ->offset($offset)
            ->get();
    
        return $result;
    }



    public static function dataListSepCount(array $filters = [])
    {
        $query1 = DB::table('pendaftaran_t as p')
        ->join('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
        ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')
        ->leftJoin('pasienadmisi_t as pas', 'pas.pasienadmisi_id', '=', 'p.pasienadmisi_id')
        ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 's.sep_id')
        ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
        ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
        ->leftJoin('asuransipasien_m as ap', 'ap.asuransipasien_id', '=', 'p.asuransipasien_id')
        ->select(DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.tgladmisi ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglmasuk'),
        DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.rencanapulang ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglpulang'),
        'pa.nama_pasien',
        's.nosep',
        DB::raw("'JKN'::text AS jaminan"),
        DB::raw('CASE WHEN s.jnspelayanan = 2 THEN \'RJ\' WHEN s.jnspelayanan = 1 THEN \'RI\' ELSE \'?\' END AS tipe'),
        'inasiscbg_t.kodeprosedur as cbg',
        DB::raw('CASE WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN \'Terkirim\' WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN \'Final\' WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN \'-\' ELSE \'-\' END AS status'),
        'ap.nopeserta',
        'pa.tanggal_lahir',
        DB::raw('concat(DATE_PART(\'year\', age(tanggal_lahir)), \' Tahun\')'),
        'pg.nama_pegawai');

    $query2 = DB::table('pendaftaran_t as p')
        ->join('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
        ->leftJoin('pasienadmisi_t as pas', 'pas.pasienadmisi_id', '=', 'p.pasienadmisi_id')
        ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')
        ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 's.sep_id')
        ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
        ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
        ->leftJoin('asuransipasien_m as ap', 'ap.asuransipasien_id', '=', 'p.asuransipasien_id')
        ->select(DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.tgladmisi ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglmasuk'),
        DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.rencanapulang ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglpulang'),
        'pa.nama_pasien',
        's.nosep',
        DB::raw("'JKN'::text AS jaminan"),
        DB::raw('CASE WHEN s.jnspelayanan = 2 THEN \'RJ\' WHEN s.jnspelayanan = 1 THEN \'RI\' ELSE \'?\' END AS tipe'),
        'inasiscbg_t.kodeprosedur as cbg',
        DB::raw('CASE WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN \'Terkirim\' WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN \'Final\' WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN \'-\' ELSE \'-\' END AS status'),
        'ap.nopeserta',
        'pa.tanggal_lahir',
        DB::raw('concat(DATE_PART(\'year\', age(tanggal_lahir)), \' Tahun\')'),
        'pg.nama_pegawai');
        // Terapkan filter pada kedua query
        self::applyFilters($query1, $filters);
        self::applyFilters($query2, $filters);
    
        // Hitung total data dari kedua query
        $resultQ1 = $query1->count();
        $resultQ2 = $query2->count();
    
        return $resultQ1 + $resultQ2;
    }
    
}
