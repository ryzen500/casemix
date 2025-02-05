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


    public function updateDataFinalisasi(array $data = [])
    {
        try {

            // Update the finalization status
            DB::table('inacbg_t')
                ->where('inacbg_nosep', $data['nomor_sep'])
                ->update(['is_finalisasi' => true]);

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