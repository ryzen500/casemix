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
