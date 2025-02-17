<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\Inasiscbg;
use App\Models\PendaftaranT;
use DB;
use Exception;

class SaveDataReeditKlaimService
{


    /**
     * Function to save
     */


    public function deleteFlagDataFinalisasi(array $data = [], array $getLoginPemakai =[])
    {

        // dd();
        try {

            

            // Update the finalization status
            DB::table('inacbg_t')
                ->where('inacbg_nosep', $data['nomor_sep'])
                ->update(['is_terkirim '=>false,'is_finalisasi' => false , 'pegfinalisasi_id'=>null, 'tglfinalisasi'=>null]);

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


    public function kirimOnlineFlagDataFinalisasi(array $data = [], array $getLoginPemakai =[])
    {

        // dd();
        try {         
            // Update the finalization status
            DB::table('inacbg_t')
                ->where('inacbg_nosep', $data['nomor_sep'])
                ->update(['is_terkirim '=>true]);

            return [
                'status' => 'success',
                'message' => 'Data berhasil kirim online',
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