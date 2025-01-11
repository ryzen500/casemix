<?php

namespace App\Http\Controllers\BPJS\SearchPeserta;

use App\Http\Controllers\Controller;
use App\Models\Bpjs\Bpjs;
use Illuminate\Http\Request;

class SearchPesertaBPJSController extends Controller
{

    protected $bpjs;



    public function __construct(Bpjs $bpjs)
    {
        $this->bpjs = $bpjs;
    }
    /**
     * Display a listing of the resource.
     */
    // public function index(Request $request)
    // {
    //     //
    //     $params = $request->input('params');  // Penentu Apakah dia diambil dari NIK Atau dari noka (Nomer Kartu )

    //     $query = $request->input('query');  // Penentu Apakah dia diambil dari NIK Atau dari noka (Nomer Kartu )

    //     // Ambil uid, timestamp, dan signature menggunakan HashBPJS
    //     list($uid, $timestmp, $hashsignature) = $this->bpjs->HashBPJS();

    //     switch ($params) {
    //         case '1':
    //          /**
    //           * Logic For search_by noka
    //           */

    //             // Ambil URL server endpoint yang sesuai
    //             $endpoints = $this->bpjs->getServerEndpoints();

    //             // Ambil endpoint untuk monitoring kunjungan
    //             $url = $endpoints['search_kartu'];

    //             // Gabungkan URL dengan parameter query1 dan query2
    //             $completeUrl = $url . '/' . $query . '/tglSEP/' . date('Y-m-d');

    //             // Lakukan request
    //             $response = $this->bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');

    //             // Decode the response if it's a JSON string
    //             if (is_string($response)) {
    //                 $decodedResponse = json_decode($response, true);
    //             } elseif (is_object($response) && method_exists($response, 'getContent')) {
    //                 $decodedResponse = json_decode($response->getContent(), true);
    //             } else {
    //                 $decodedResponse = $response;
    //             }

    //             // Kembalikan response ke frontend sebagai JSON
    //             // return response()->json($decodedResponse, 200);
    //             break;

    //         case '2':
    //             /**
    //              * Logic untuk menampilkan data berdasarkan  nik 
    //              */


    //             // Ambil URL server endpoint yang sesuai
    //             $endpoints = $this->bpjs->getServerEndpoints();

    //             // Ambil endpoint untuk monitoring kunjungan
    //             $url = $endpoints['search_nik'];

    //             // Gabungkan URL dengan parameter query1 dan query2
    //             $completeUrl = $url . '/' . $query . '/tglSEP/' . date('Y-m-d');

    //             // Lakukan request
    //             $response = $this->bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');

    //             // Decode the response if it's a JSON string
    //             if (is_string($response)) {
    //                 $decodedResponse = json_decode($response, true);
    //             } elseif (is_object($response) && method_exists($response, 'getContent')) {
    //                 $decodedResponse = json_decode($response->getContent(), true);
    //             } else {
    //                 $decodedResponse = $response;
    //             }
    //             break;
    //         default:
    //             echo 'Something Wrong with this functions ';
    //             break;
    //     }

    // }

    public function index(Request $request)
{
    $params = $request->input('params');
    $query = $request->input('query');

    // Ambil uid, timestamp, dan signature menggunakan HashBPJS
    list($uid, $timestmp, $hashsignature) = $this->bpjs->HashBPJS();

    // Map endpoint berdasarkan params
    $endpointMap = [
        '1' => 'search_kartu', // Untuk noka
        '2' => 'search_nik'   // Untuk nik
    ];

    // Validasi params dan ambil URL endpoint
    if (!isset($endpointMap[$params])) {
        return response()->json(['error' => 'Invalid parameter'], 400);
    }

    $url = $this->bpjs->getServerEndpoints()[$endpointMap[$params]];

    // Gabungkan URL dengan parameter query dan tanggal
    $completeUrl = $url . '/' . $query . '/tglSEP/' . date('Y-m-d');

    // Lakukan request ke API
    $response = $this->bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');

    // Decode response jika perlu
    $decodedResponse = $this->decodeResponse($response);

    // Kembalikan response ke frontend
    return response()->json($decodedResponse, 200);
}

/**
 * Decode response dengan aman
 *
 * @param mixed $response
 * @return array
 */
private function decodeResponse($response)
{
    if (is_string($response)) {
        return json_decode($response, true);
    }

    if (is_object($response) && method_exists($response, 'getContent')) {
        return json_decode($response->getContent(), true);
    }

    return $response;
}

}
