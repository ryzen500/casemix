<?php

namespace App\Http\Services;

use App\Models\Bpjs\Bpjs;


class SearchSepService
{

    public function getRiwayatData($nopeserta){
        $bpjs =new Bpjs();
        // Ambil uid, timestamp, dan signature menggunakan HashBPJS
        list($uid, $timestmp, $hashsignature) = $bpjs->HashBPJS();

        // Ambil URL server endpoint yang sesuai
        $endpoints = $bpjs->getServerEndpoints();
        $url = $endpoints['search_sep'];

        // Gabungkan URL dengan parameter
        $completeUrl = $url .'/'. $nopeserta;
        // Lakukan request
        $response = $bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');
        // Decode the response jika berbentuk JSON string
        $decodedResponse = is_string($response) ? json_decode($response, true) : $response;
        // Kembalikan response ke frontend sebagai JSON
        return response()->json($decodedResponse, 200);

    }
    public function getRujukan($noRujukan){
        $bpjs =new Bpjs();
        // Ambil uid, timestamp, dan signature menggunakan HashBPJS
        list($uid, $timestmp, $hashsignature) = $bpjs->HashBPJS();

        // Ambil URL server endpoint yang sesuai
        $endpoints = $bpjs->getServerEndpoints();
        $url = $endpoints['rujukan'];

        // Gabungkan URL dengan parameter
        $completeUrl = $url .'/'. $noRujukan;
        // Lakukan request
        $response = $bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');
        // Decode the response jika berbentuk JSON string
        $decodedResponse = is_string($response) ? json_decode($response, true) : $response;
        // Kembalikan response ke frontend sebagai JSON
        return response()->json($decodedResponse, 200);

    }
    public function getRujukanRs($noRujukan){
        $bpjs =new Bpjs();
        // Ambil uid, timestamp, dan signature menggunakan HashBPJS
        list($uid, $timestmp, $hashsignature) = $bpjs->HashBPJS();

        // Ambil URL server endpoint yang sesuai
        $endpoints = $bpjs->getServerEndpoints();
        $url = $endpoints['rujukan_rs'];

        // Gabungkan URL dengan parameter
        $completeUrl = $url .'/'. $noRujukan;
        // Lakukan request
        $response = $bpjs->request($completeUrl, $hashsignature, $uid, $timestmp, 'GET');
        // Decode the response jika berbentuk JSON string
        $decodedResponse = is_string($response) ? json_decode($response, true) : $response;
        // Kembalikan response ke frontend sebagai JSON
        return response()->json($decodedResponse, 200);
    }
}
