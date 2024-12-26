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
}
