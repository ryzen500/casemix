<?php

namespace App\Models\Bpjs;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bpjs extends Model
{
    use HasFactory;


    /**
     * Summary of HashBPJS (Permbuatan generate hash bpjs dan signaturenya)
     * @param mixed $args
     * @return array
     */
    public function HashBPJS($args = '')
    {
        $uid = env('BPJS_UID');
        date_default_timezone_set('UTC');
        $timestmp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $str = $uid . "&" . $timestmp;
        $secret = env('SECRET_KEY');
        $hasher = base64_encode(hash_hmac('sha256', utf8_encode($str), utf8_encode($secret), TRUE)); //signature;
        return array($uid, $timestmp, $hasher);
    }

    // function decrypt
    /**
     * Summary of stringDecrypt (Decrypt ini berbeda dengan  fungsi yang ada di modul casemix)
     * @param mixed $key
     * @param mixed $string
     * @return bool|string
     */
    public function stringDecrypt($key, $string){
            
      
        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));
  
        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);
  
        return $output;
    }

    public function decompress($string){
  
        return \LZCompressor\LZString::decompressFromEncodedURIComponent($string);

    }

    // Implementasi fungsi request dengan cURL
    /**
     * Summary of request 
     * Fungsi Untuk mengirimkan Permintaan Ke Endpoint vclaim
     * @param mixed $url
     * @param mixed $hashsignature
     * @param mixed $uid
     * @param mixed $timestmp
     * @param mixed $method
     * @param mixed $myvars
     * @param mixed $contentType
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function request($url, $hashsignature, $uid, $timestmp, $method = '', $myvars = '', $contentType = 'Application/x-www-form-urlencoded')
    {
        $session = curl_init($url);
        $arrheader = array(
            'X-cons-id: ' . $uid,
            'X-timestamp: ' . $timestmp,
            'X-signature: ' . $hashsignature,
            'Accept: application/json',
            'Content-Type: ' . $contentType,
        );

            $arrheader[] = 'user_key: ' . env('SECRET_KEY');

        curl_setopt($session, CURLOPT_URL, $url);
        curl_setopt($session, CURLOPT_HTTPHEADER, $arrheader);
        curl_setopt($session, CURLOPT_VERBOSE, true);
        curl_setopt($session, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($session, CURLOPT_SSL_VERIFYPEER, 0);

        switch ($method) {
            case 'POST':
                curl_setopt($session, CURLOPT_POST, true);
                curl_setopt($session, CURLOPT_POSTFIELDS, $myvars);
                break;
            case 'PUT':
                curl_setopt($session, CURLOPT_CUSTOMREQUEST, "PUT");
                curl_setopt($session, CURLOPT_POSTFIELDS, $myvars);
                break;
            case 'DELETE':
                curl_setopt($session, CURLOPT_CUSTOMREQUEST, "DELETE");
                curl_setopt($session, CURLOPT_POSTFIELDS, $myvars);
                break;
        }

        curl_setopt($session, CURLOPT_SSL_CIPHER_LIST, 'DEFAULT@SECLEVEL=1');
        curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($session);
        $err = curl_errno($session);
        $err_msg = curl_error($session);
        curl_close($session);

        if ($err == 0) {
            $json_res = json_decode($response, true);  // Menggunakan json_decode untuk parsing


            if (!empty($json_res['metaData']) && $json_res['metaData']['code'] == 200 && !empty($json_res['response']) && !is_array($json_res['response'])) {

                // Dekripsi dan decompress jika diperlukan
                $str_dec = $this->stringDecrypt($uid . env('SECRET_KEY') . $timestmp, $json_res['response']);

                $res = $this->decompress($str_dec);

                $res2 = json_decode($res, true);  // Menggunakan json_decode untuk parsing

                if (!empty($res2)) {
                    $json_res['response'] = $res2;
                } else {
                    $json_res['response'] = "";
                }
            }

            $json_res['request_vars'] = $myvars;
            return response()->json($json_res);  // Menggunakan response()->json() untuk mengembalikan data
        } else {
            return response()->json([
                'metaData' => [
                    'code' => $err,
                    'message' => '[CURL] ' . $err_msg,
                ],
                'request_vars' => $myvars,
            ], 500);  // Menambahkan status code 500 untuk error CURL
        }
    }



    /**
     * Summary of getServerEndpoints (List Endpoint Server BPJS )
     * @return array
     */
    public function getServerEndpoints()
    {
        $endpoints = [
            'search_poli' => 'referensi/poli',
            'fasilitas_kesehatan' => 'referensi/faskes',
            'search_diagnosa' => 'referensi/diagnosa',
            'search_procedure' => 'referensi/procedure',
            'search_kelas_rawat' => 'referensi/kelasrawat',
            'search_dokter' => 'referensi/dokter',
            'search_dpjp' => 'referensi/dokter/pelayanan',
            'search_suplesi' => 'sep/JasaRaharja/Suplesi',
            'search_spesialistik' => 'referensi/spesialistik',
            'search_ruangrawat' => 'referensi/ruangrawat',
            'search_carakeluar' => 'referensi/carakeluar',
            'search_pascapulang' => 'referensi/pascapulang',
            'search_propinsi' => 'referensi/propinsi',
            'search_kabupaten' => 'referensi/kabupaten/propinsi',
            'search_kecamatan' => 'referensi/kecamatan/kabupaten',
            'search_kartu' => 'Peserta/nokartu',
            'search_nik' => 'Peserta/nik',
            'search_sep' => 'SEP',
            'monitoring_kunjungan' => 'Monitoring/Kunjungan',

            // Tambahkan endpoint lain sesuai kebutuhan...
        ];

        $server = [];
        foreach ($endpoints as $key => $serviceName) {
            $server[$key] = $this->getUrlPort($serviceName);
        }

        return $server;
    }

    /**
     * Summary of getUrlPort ( Setup Base URL )
     * @param mixed $serviceName
     * @return string
     */
    public function getUrlPort($serviceName)
    {
        $baseUrl = env('BPJS_HOST'); // URL utama diambil dari env
        $portBpjs = env('SERVICE_NAME'); // Port diambil dari env

        return $baseUrl . $portBpjs  . $serviceName; // URL gabungan
    }



}
