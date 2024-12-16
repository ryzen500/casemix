<?php
namespace App\Models\Casemix;

use Exception;
use Http;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class Inacbg extends Model
{
    protected $table = 'inacbg_t';

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
        // $iv = openssl_random_pseudo_bytes($iv_size); // dengan catatan dibawah
        $iv = random_bytes($iv_size); // dengan catatan dibawah
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
        if (!self::inacbg_compare($signature, $calc_signature)) {
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
            'tgl_lahir' => 'required|date',
            'gender' => 'required|in:male,female',
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
            return $this->processResponse($response , $key);
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
        $url = $this->url; // Assuming $this->url is already set
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
        $decryptedResponse = $this->inacbg_decrypt($response, $key);
        $decodedResponse = json_decode($decryptedResponse, true);

        if ($decodedResponse['metadata']['code'] == 200) {
            return [
                'success' => true,
                'message' => 'SUKSES',
                'data' => $decodedResponse['data'] ?? null,
            ];
        }

        return [
            'success' => false,
            'message' => $decodedResponse['metadata']['message'] ?? 'Unknown error',
        ];
    }
}
