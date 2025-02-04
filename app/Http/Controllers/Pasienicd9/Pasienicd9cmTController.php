<?php

namespace App\Http\Controllers\Pasienicd9;

use App\Http\Controllers\Controller;
use App\Http\Services\Action\SaveDataPasienicd9Service;
use Illuminate\Http\Request;

class Pasienicd9cmTController extends Controller
{
        //inset morbiditas
        public function insertPasienicd9T(Request $request){
            $diagnosa_array = $request->input("payload") ?? "";
            $saveService = new SaveDataPasienicd9Service();
            // dd($diagnosa_array);
            $addMorbiditas = $saveService->addDataPasienicd9T($diagnosa_array);
            return $addMorbiditas;
        }
    
        //delete morbiditas
        public function removePasienicd9T(Request $request){
            $diagnosa_array = $request->input("payload") ?? "";
            $saveService = new SaveDataPasienicd9Service();
            $addMorbiditas = $saveService->addDataPasienicd9R($diagnosa_array[0]);
            $removeMorbiditas = $saveService->removeDataPasienicd9T($diagnosa_array[0]);
    
            return $addMorbiditas;
        }
        
        //inset morbiditas
        public function updatePasienicd9T(Request $request){
            $diagnosa_array = $request->input("payload") ?? "";
            $saveService = new SaveDataPasienicd9Service();
            $addMorbiditas = $saveService->updateDataPasienicd9($diagnosa_array);
            return $addMorbiditas;
        }
}
