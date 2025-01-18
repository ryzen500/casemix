<?php

namespace App\Http\Services;

use App\Models\Bpjs\Bpjs;
use Carbon\Carbon;


class MonitoringHistoryService
{

    public function getRiwayatData($nopeserta){
        $bpjs =new Bpjs();
        $startDate = Carbon::now()->subDays(90);
        $startDate= $startDate->format('Y-m-d');
        $endDate=Carbon::now();
        $endDate=$endDate->format('Y-m-d');

        // dd($nopeserta,$startDate,$endDate);

        // Ambil uid, timestamp, dan signature menggunakan HashBPJS
        list($uid, $timestmp, $hashsignature) = $bpjs->HashBPJS();

        // Ambil URL server endpoint yang sesuai
        $endpoints = $bpjs->getServerEndpoints();
        $url = $endpoints['riwayat_pelayanan'];

        // Gabungkan URL dengan parameter
        $completeUrl = $url . '/NoKartu/' . $nopeserta . '/tglMulai/' . $startDate . '/tglAkhir/' . $endDate;

        // Lakukan request
        $response = $bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');
        // Decode the response jika berbentuk JSON string
        $decodedResponse = is_string($response) ? json_decode($response, true) : $response;
        // Kembalikan response ke frontend sebagai JSON
        return response()->json($decodedResponse, 200);

    }
}
