<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\Inasiscbg;
use App\Models\PendaftaranT;
use DB;
use Exception;

class SaveDataFinalisasiService
{


    /**
     * Function to save
     */


    public function updateDataFinalisasi(array $data = [], array $getLoginPemakai =[])
    {

        // dd();
        try {

            

            // Update the finalization status
            DB::table('inacbg_t')
                ->where('inacbg_nosep', $data['nomor_sep'])
                ->update(['is_finalisasi' => true , 'pegfinalisasi_id'=>$getLoginPemakai[0]['loginpemakai_id'] , 'tglfinalisasi'=>date("Y-m-d H:i:s")]);

            return [
                'status' => 'success',
                'message' => 'Data berhasil difinalisasi',
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