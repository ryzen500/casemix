<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\SepT;
use DB;
use Exception;

class SaveSepTService
{


    public function saveSinkronSep(array $data = [], int $pendaftaran_id )
    {
        try {       
            // dd($data);
            $result = DB::table('sep_t')->insert($data);
            if ($result) {
                $sep = DB::table('sep_t')
                ->where('nosep', $data['nosep'])
                ->orderBy('sep_id','desc')
                ->first();
                DB::table('pendaftaran_t')
                ->where('pendaftaran_id', $pendaftaran_id)
                ->update(['sep_id'=>$sep->sep_id]);
                // return response()->json(['sep_id'=>$sep->sep_id,'status' => 'success','message' => 'Data berhasil disimpan'], 200);
            }
            // Update the finalization status


            return [
                'sep_id'=>!empty($sep)?$sep->sep_id:null,
                'status' => 'success',
                'message' => 'Data berhasil disimpan',
            ];
        } catch (Exception $e) {
            return [
                'status' => 'failed',
                'message' => $e->getMessage(),
            ];
        }
    }


    

}

?>