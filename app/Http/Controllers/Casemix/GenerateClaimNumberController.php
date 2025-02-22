<?php

namespace App\Http\Controllers\Casemix;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Casemix\Inacbg;
use App\Models\DiagnosaicdixM;
use App\Models\DiagnosaM;
use PaginationLibrary\Pagination;


class GenerateClaimNumberController extends Controller
{
    //

    protected $inacbg;

    public function __construct(Inacbg $inacbg)
    {
        $this->inacbg = $inacbg;
    }


    public function index(Request $request):mixed 
    {

        // Ambil keynya dari  ENV 
        $key = env('INACBG_KEY');


        // dd($request->all);
        $nomor_kartu = $request->input('nomor_kartu') ?? null;
        $nomor_sep = $request->input('noSep') ?? null;
        $nomor_rm = $request->input('no_rekam_medik') ?? null;
        $nama_pasien = $request->input('nama_pasien') ?? null;
        $tgl_lahir = $request->input('tgl_lahir') ?? null;
        $gender = $request->input('gender') ?? null;
        if($gender =='P'){
            $gender =2;
        }else if("L"){
            $gender =1;
        }
        // Structur Payload 
        $data = [
            'nomor_kartu' => $nomor_kartu,
            'nomor_sep' => $nomor_sep,
            'nomor_rm' => $nomor_rm,
            'nama_pasien' => $nama_pasien,
            'tgl_lahir' => $tgl_lahir,
            'gender' => $gender,
        ];


        // result kirim claim
        $results = $this->inacbg->newClaim($data, $key);
        //if false and message =  Nomor Klaim sudah terpakai. Silakan generate_claim_number lagi. then generate claim number first
        // if($results['success']==false && $results['message']=='Nomor Klaim sudah terpakai. Silakan generate_claim_number lagi.'){
        //     // documentaion number 18
        //     $results2 = $this->inacbg->generate_claim_number($data, $key);
        //     $data = [
        //         'nomor_kartu' => $nomor_kartu,
        //         'nomor_sep' => $results2['data']['claim_number'],
        //         'nomor_rm' => $nomor_rm,
        //         'nama_pasien' => $nama_pasien,
        //         'tgl_lahir' => $tgl_lahir,
        //         'gender' => $gender,
        //     ];            
        //     // result kirim claim
        //     $results = $this->inacbg->newClaim($data, $key);
        // }
        // Kembalikan hasil sebagai JSON response
        return response()->json($results, 200);
    }
    public function autocompleteDiagnosa(Request $request):mixed {

        // Request Input 

        
        $keyword = $request->input('keyword') ?? null;

        $data = [
            'keyword'=> $keyword
        ];
        $results= DiagnosaM::getDiagnosaAutocomplete($keyword);

        return response()->json($results,200);
    }
    public function autocompleteDiagnosaCode(Request $request):mixed {

        // Request Input 

        
        $keyword = $request->input('keyword') ?? null;

        $data = [
            'keyword'=> $keyword
        ];
        $results= DiagnosaM::getDiagnosaByCodeAutocomplete($keyword);

        return response()->json($results,200);
    }
    public function autocompleteDiagnosaIX(Request $request):mixed {

        // Request Input 

        
        $keyword = $request->input('keyword') ?? null;

        $data = [
            'keyword'=> $keyword
        ];
        $results= DiagnosaicdixM::getDiagnosaAutocomplete($keyword);

        return response()->json($results,200);
    }
    public function autocompleteDiagnosaIXCode(Request $request):mixed {

        // Request Input 

        
        $keyword = $request->input('keyword') ?? null;

        $data = [
            'keyword'=> $keyword
        ];
        $results= DiagnosaicdixM::getDiagnosaByCodeAutocomplete($keyword);

        return response()->json($results,200);
    }
}
