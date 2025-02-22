<?php

namespace App\Http\Controllers\Casemix;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Casemix\Inacbg;
use App\Models\DiagnosaicdixM;
use App\Models\DiagnosaM;
use PaginationLibrary\Pagination;


class SearchDiagnosaController extends Controller
{
    //

    protected $inacbg;

    public function __construct(Inacbg $inacbg)
    {
        $this->inacbg = $inacbg;
    }


    public function index(Request $request):mixed {

        // Request Input 
        $key = env('INACBG_KEY');


        $keyword = $request->input('keyword') ?? null;

        $data = [
            'keyword'=> $keyword
        ];

        $results = $this->inacbg->searchDiagnosa($data, $key);

        return response()->json($results,200);
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
