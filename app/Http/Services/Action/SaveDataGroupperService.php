<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\Inasiscbg;
use App\Models\PendaftaranT;
use Exception;

class SaveDataGroupperService
{


    /**
     * Function to save
     */

    public function addDataInasiscbg(array $results = [], array $data = [], array $dataAuthor)
    {

        // Periksa keberadaan Inacbg (Data yang sudah dilakukan simpan klaim )

        $Inacbg = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();
      
        //Validasi apakah inasiscbg_t ini sudah ada atau belum 
        
        $inasiscbg = Inasiscbg::where('pendaftaran_id', $Inacbg['pendaftaran_id'])->first();
        try {
            $inasiscbgData = [
             'pendaftaran_id'=> !empty($Inacbg['pendaftaran_id']) && $Inacbg['pendaftaran_id'] !== '' ? $Inacbg['pendaftaran_id'] : null,
             'inacbg_id'=> !empty($Inacbg['inacbg_id']) && $Inacbg['inacbg_id'] !== '' ? $Inacbg['inacbg_id'] : null,
             'inasiscbg_tgl'=> date('Y-m-d H:i:s'),
             'kodeprosedur'=> $results['data']['cbg']['code'],
             'namaprosedur'=> $results['data']['cbg']['description'],
             'plafonprosedur'=> $results['data']['cbg']['base_tariff'],
             'create_time'=> date('Y-m-d H:i:s'),
            'create_loginpemakai_id'=>$dataAuthor['create_loginpemakai_id'],
            'create_ruangan'=>429
            ];

            if ($inasiscbg) {
                // Jika SEP ditemukan, lakukan update
                $inasiscbg->update($inasiscbgData);
                $message = 'Data berhasil diperbarui';

            }else{


                Inasiscbg::create($inasiscbgData);
                \Log::info('Data Berhasil Disimpan:', $inasiscbgData);

                $message = 'Data berhasil disimpan';
            }

            // } else {
            //     // Jika SEP tidak ditemukan, lakukan create
            //     Inasiscbg::create($inasiscbgData);
            //     $message = 'Data berhasil disimpan';
            // }

            return [
                'status' => 'success',
                'message' => $message,
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