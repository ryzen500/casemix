<?php

namespace App\Http\Controllers\Casemix;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Casemix\Inacbg;
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

}
