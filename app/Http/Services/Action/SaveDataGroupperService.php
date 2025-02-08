<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\Inasiscbg;
use App\Models\InasismdcT;
use App\Models\PendaftaranT;
use DB;
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
        $inasismdc = InasismdcT::where('pendaftaran_id', $Inacbg['pendaftaran_id'])->first();
        // dd($results['data']['response_inagrouper']);
        try {
            $inasiscbgData = [
             'pendaftaran_id'=> !empty($Inacbg['pendaftaran_id']) && $Inacbg['pendaftaran_id'] !== '' ? $Inacbg['pendaftaran_id'] : null,
             'inacbg_id'=> !empty($Inacbg['inacbg_id']) && $Inacbg['inacbg_id'] !== '' ? $Inacbg['inacbg_id'] : null,
             'inasiscbg_tgl'=> date('Y-m-d H:i:s'),
             'kodeprosedur'=>$results['data']['response']['cbg']['code'],
             'namaprosedur'=> $results['data']['response']['cbg']['description'],
             'plafonprosedur'=> $results['data']['response']['cbg']['base_tariff'],
             'create_ruangan'=>429
            ];

            $inasismdc_t = [
                'pendaftaran_id'=> !empty($Inacbg['pendaftaran_id']) && $Inacbg['pendaftaran_id'] !== '' ? $Inacbg['pendaftaran_id'] : null,
                'inacbg_id'=> !empty($Inacbg['inacbg_id']) && $Inacbg['inacbg_id'] !== '' ? $Inacbg['inacbg_id'] : null,
                'inasismdc_tgl'=> date('Y-m-d H:i:s'),
                'mdc_number'=> $results['data']['response_inagrouper']['mdc_number'],
                'mdc_description'=> $results['data']['response_inagrouper']['mdc_description'],
                'drg_code'=> $results['data']['response_inagrouper']['drg_code'],
                'drg_description'=>$results['data']['response_inagrouper']['drg_description'],
                'create_ruangan'=>429
               ];

            if ($inasiscbg) {
                // Jika SEP ditemukan, lakukan update
                $inasiscbgData['update_time'] = date("Y-m-d H:i:s");
                $inasiscbgData['update_loginpemakai_id'] =!empty($dataAuthor['create_loginpemakai_id']) && $dataAuthor['create_loginpemakai_id'] !== '' ? $dataAuthor['create_loginpemakai_id'] : null;
                
                $inasiscbg->update($inasiscbgData);


                DB::table('inacbg_t')
                ->where('inacbg_nosep', $data['nomor_sep'])
                ->update(['tarifgruper' =>  $results['data']['response']['cbg']['base_tariff']]);
                $message = 'Data berhasil diperbarui';

            } else{
                $inasiscbgData['create_time'] = date("Y-m-d H:i:s");
                $inasiscbgData['create_loginpemakai_id'] =!empty($dataAuthor['create_loginpemakai_id']) && $dataAuthor['create_loginpemakai_id'] !== '' ? $dataAuthor['create_loginpemakai_id'] : null;
                

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
            $message = 'Data Gagal disimpan';

            return [
                'status' => 'failed',
                'message' => $message,
            ];
        }
    }

    public function addDataInasisdmc(array $results = [], array $data = [], array $dataAuthor)
    {

        // Periksa keberadaan Inacbg (Data yang sudah dilakukan simpan klaim )

        $Inacbg = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();
      
        //Validasi apakah inasiscbg_t ini sudah ada atau belum 
        
        $inasismdc = InasismdcT::where('pendaftaran_id', $Inacbg['pendaftaran_id'])->first();
        // dd($results['data']['response_inagrouper']);
        try {

            $inasismdc_t = [
                'pendaftaran_id'=> !empty($Inacbg['pendaftaran_id']) && $Inacbg['pendaftaran_id'] !== '' ? $Inacbg['pendaftaran_id'] : null,
                'inacbg_id'=> !empty($Inacbg['inacbg_id']) && $Inacbg['inacbg_id'] !== '' ? $Inacbg['inacbg_id'] : null,
                'inasismdc_tgl'=> date('Y-m-d H:i:s'),
                'mdc_number'=> $results['data']['response_inagrouper']['mdc_number'],
                'mdc_description'=> $results['data']['response_inagrouper']['mdc_description'],
                'drg_code'=> $results['data']['response_inagrouper']['drg_code'],
                'drg_description'=>$results['data']['response_inagrouper']['drg_description'],
                'create_ruangan'=>429
               ];

             if($inasismdc){

                // Jika Terdapat  V6 
                $inasismdc_t['update_time'] = date("Y-m-d H:i:s");
                $inasismdc_t['update_loginpemakai_id'] =!empty($dataAuthor['create_loginpemakai_id']) && $dataAuthor['create_loginpemakai_id'] !== '' ? $dataAuthor['create_loginpemakai_id'] : null;
               
                $inasismdc->update($inasismdc_t);

            } else{
               
                // V6

                $inasismdc_t['create_time'] = date("Y-m-d H:i:s");
                $inasismdc_t['create_loginpemakai_id'] =!empty($dataAuthor['create_loginpemakai_id']) && $dataAuthor['create_loginpemakai_id'] !== '' ? $dataAuthor['create_loginpemakai_id'] : null;
                
                // dd($inasismdc_t);
                InasismdcT::create($inasismdc_t);
                
                

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
            $message = $e->getMessage();

            return [
                'status' => 'failed',
                'message' => $message,
            ];
        }
    }




}

?>