<?php

namespace App\Http\Controllers\BPJS\Monitoring;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bpjs\Bpjs;

class MonitoringBPJSController extends Controller
{
    protected $bpjs;

    public function __construct(Bpjs $bpjs)
    {
        $this->bpjs = $bpjs;
    }



    /**
     * Summary of index ( This is Function for Endpoint Monitoring  Kunjungan)
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Ambil data dari request
        $query1 = $request->input('query1');  // Tanggal atau parameter lainnya
        $query2 = $request->input('query2') ?? 2;  // Jenis pelayanan atau parameter lainnya

        // Ambil uid, timestamp, dan signature menggunakan HashBPJS
        list($uid, $timestmp, $hashsignature) = $this->bpjs->HashBPJS();

        // Ambil URL server endpoint yang sesuai
        $endpoints = $this->bpjs->getServerEndpoints();

        // Ambil endpoint untuk monitoring kunjungan
        $url = $endpoints['monitoring_kunjungan'];

        // Gabungkan URL dengan parameter query1 dan query2
        $completeUrl = $url . '/Tanggal/' . $query1 . '/JnsPelayanan/' . $query2;

        // Lakukan request
        $response = $this->bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');

        // Decode the response if it's a JSON string
        if (is_string($response)) {
            $decodedResponse = json_decode($response, true);
        } elseif (is_object($response) && method_exists($response, 'getContent')) {
            // Handle object responses with getContent
            $decodedResponse = json_decode($response->getContent(), true);
        } else {
            // Fallback for unknown response formats
            $decodedResponse = $response;
        }

        // Kembalikan response ke frontend sebagai JSON
        return response()->json($decodedResponse, 200);
    }

    /**
     * Summary of listDataKlaim ( Berikut merupakan endpoint monitoring Data Klaim)
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function listDataKlaim(Request $request)
{
    // Validasi input
    $validated = $request->validate([
        'tanggal_pulang' => 'required|date',          // Tanggal format: yyyy-mm-dd
        'jenis_pelayanan' => 'required|integer|in:1,2', // Jenis pelayanan: 1 (Inap), 2 (Jalan)
        'status_klaim' => 'required|integer|in:1,2,3',  // Status klaim: 1 (Proses Verifikasi), 2 (Pending Verifikasi), 3 (Klaim)
    ]);

    // Ambil data dari request setelah divalidasi
    $tanggal_pulang = $validated['tanggal_pulang'];
    $jenis_pelayanan = $validated['jenis_pelayanan'];
    $status_klaim = $validated['status_klaim'];

    // Ambil uid, timestamp, dan signature menggunakan HashBPJS
    list($uid, $timestmp, $hashsignature) = $this->bpjs->HashBPJS();

    // Ambil URL server endpoint yang sesuai
    $endpoints = $this->bpjs->getServerEndpoints();
    $url = $endpoints['monitoring_klaim'];

    // Gabungkan URL dengan parameter
    $completeUrl = $url . '/Tanggal/' . $tanggal_pulang . '/JnsPelayanan/' . $jenis_pelayanan . '/Status/' . $status_klaim;

    // Lakukan request
    $response = $this->bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');

    // Decode the response jika berbentuk JSON string
    $decodedResponse = is_string($response) ? json_decode($response, true) : $response;

    // Kembalikan response ke frontend sebagai JSON
    return response()->json($decodedResponse, 200);
}

}
