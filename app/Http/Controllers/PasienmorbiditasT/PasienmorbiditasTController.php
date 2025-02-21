<?php

namespace App\Http\Controllers\PasienmorbiditasT;

use App\Http\Controllers\Controller;
use App\Http\Services\Action\SaveDataPasienmorbiditasTService;
use Illuminate\Http\Request;

class PasienmorbiditasTController extends Controller
{
    //inset morbiditas
    public function insertMorbiditasT(Request $request){
        $diagnosa_array = $request->input("payload") ?? "";
        $saveService = new SaveDataPasienmorbiditasTService();
        $addMorbiditas = $saveService->addDataPasienMordibitas($diagnosa_array);
        return $addMorbiditas;
    }

    //delete morbiditas
    public function removeMorbiditasT(Request $request){
        $diagnosa_array = $request->input("payload") ?? "";
        $saveService = new SaveDataPasienmorbiditasTService();
        $addMorbiditas = $saveService->addDataPasienMordibitasR($diagnosa_array[0]);
        $removeMorbiditas = $saveService->removeDataPasienMordibitas($diagnosa_array[0]);

        return $addMorbiditas;
    }
    
    //inset morbiditas
    public function updateMorbiditasT(Request $request){
        $diagnosa_array = $request->input("payload") ?? "";
        // dd($diagnosa_array);
        $saveService = new SaveDataPasienmorbiditasTService();
        $addMorbiditas = $saveService->updateDataPasienMordibitas($diagnosa_array);
        return $addMorbiditas;
    }
}
