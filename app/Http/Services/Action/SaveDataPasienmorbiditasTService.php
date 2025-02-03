<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\PasienmorbiditasT;
use App\Models\PendaftaranT;
// use DB;
use Exception;
use Log;
use Illuminate\Support\Facades\DB;

class SaveDataPasienmorbiditasTService
{


    /**
     * Function to save
     */

    public function addDataPasienMordibitas(array $dataDiagnosa = []){
         $RegisterData = PendaftaranT::where('pendaftaran_id', $dataDiagnosa['pendaftaran_id'])->first();
        //  dd($dataDiagnosa,$RegisterData);

         // dd($dataDiagnosa);
         // Periksa keberadaan SEP
        //  $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();
 
         try {             
            $preparedData = [
                'pasien_id' => $RegisterData['pasien_id'] ?? null,
                'pendaftaran_id' => $RegisterData['pendaftaran_id'] ?? null,
                'pegawai_id' => $dataDiagnosa['pegawai_id'] ?? null,
                'diagnosa_id' => $dataDiagnosa['diagnosa_id'] ?? null,
                'tglmorbiditas' => $dataDiagnosa['tgl_pendaftaran'] ?? null, // Tambahkan tanggal saat ini
                'kasusdiagnosa' => $dataDiagnosa['kasusdiagnosa'] ?? null, // Tambahkan tanggal saat ini
                'ruangan_id' => $RegisterData['ruangan_id'] ?? null, // Tambahkan tanggal saat ini
                'create_time' => date('Y-m-d H:i:s'), // Tambahkan tanggal saat ini
                'create_loginpemakai_id' => $dataDiagnosa['loginpemakai_id'], // Tambahkan tanggal saat ini
                'create_ruangan' => 429,
                'kelompokdiagnosa_id' => $dataDiagnosa['kelompokdiagnosa_id'] ?? null,
                'jeniskasuspenyakit_id' => $RegisterData['jeniskasuspenyakit_id'] ?? null,
                'kelompokumur_id' => $RegisterData['kelompokumur_id'],
                'golonganumur_id' =>$RegisterData['golonganumur_id'],
                // Tambahkan field lain sesuai kebutuhan
            ];
             $result = DB::table('pasienmorbiditas_t')->insert( $preparedData);
            $data = PasienmorbiditasT::getMorbiditasDesc($RegisterData['pendaftaran_id']);

            // dd($data);
             Log::info('Data pasienmorbiditasT :', $preparedData);
             
            if ($result) {
                return response()->json(['success' => true,'message' => 'Data berhasil disimpan','pasienmorbiditasT'=>$data], 200);
            }else{
                return response()->json(['success' => false,'message' => 'Terjadi error saat menyimpan data'], 500);
            }
             // Cek apakah insert berhasil
             if ($result ) {
                 Log::info('Data berhasil disimpan ke tabel pasienmorbiditas_t', ['data' => $dataDiagnosa]);
                 return response()->json(['success' => true, 'message' => 'Data berhasil disimpan']);
             } else {
                 Log::warning('Proses penyimpanan gagal tanpa error SQL.', ['data' => $dataDiagnosa]);
                 return response()->json(['success' => false, 'message' => 'Proses penyimpanan gagal']);
             }
         } catch (\Exception $e) {
            
             // Log error jika terjadi exception
             Log::error('Terjadi error saat menyimpan data ke tabel pasienmorbiditas_t', [
                 'error' => $e->getMessage(),
                 'data' => $preparedData,
             ]);
 
             // Kembalikan pesan error ke frontend atau log
             return response()->json(['success' => false, 'message' => 'Terjadi error saat menyimpan data', 'error' => $e->getMessage()]);
         }
    }
 
    public function addDataPasienMordibitasR(array $dataDiagnosa = []){
        // $RegisterData2 = PasienmorbiditasT::where('pasienmorbiditas_id', $dataDiagnosa['pasienmorbiditas_id'])->first();
        $RegisterData = DB::table('pasienmorbiditas_t ')
        ->select(
            DB::raw('pasienmorbiditas_t.*')
        )
        ->from('pasienmorbiditas_t')
        ->where('pasienmorbiditas_t.pasienmorbiditas_id','=', $dataDiagnosa['pasienmorbiditas_id'])
        ->first();

        // dd($dataDiagnosa,$RegisterData);

        // dd($dataDiagnosa);
        // Periksa keberadaan SEP
       //  $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();

        try {        
           $preparedData = (array)$RegisterData;
            // Modify the properties as needed
            $preparedData['pasienmorbiditast_id'] = $RegisterData->pasienmorbiditas_id;
            $preparedData['update_loginpemakai_id']= $dataDiagnosa['update_loginpemakai_id'];
            $preparedData['update_time']= date('Y-m-d H:i:s');
            unset($preparedData['pasienmorbiditas_id']);

            $result = DB::table('pasienmorbiditas_r')->insert( $preparedData);
           // dd($data);
            Log::info('Data pasienmorbiditasT :', $preparedData);
            
           if ($result) {
               return response()->json(['success' => true,'message' => 'Data berhasil dihapus'], 200);
           }else{
               return response()->json(['success' => false,'message' => 'Terjadi error saat hapus data'], 500);
           }
            // Cek apakah insert berhasil
            if ($result ) {
                Log::info('Data berhasil disimpan ke tabel pasienmorbiditas_t');
                return response()->json(['success' => true, 'message' => 'Data berhasil disimpan']);
            } else {
                Log::warning('Proses penyimpanan gagal tanpa error SQL.');
                return response()->json(['success' => false, 'message' => 'Proses penyimpanan gagal']);
            }
        } catch (\Exception $e) {
            // dd($e);
            // Log error jika terjadi exception
            Log::error('Terjadi error saat menyimpan data ke tabel pasienmorbiditas_t', [
                'error' => $e->getMessage(),
                'data' => $preparedData,
            ]);

            // Kembalikan pesan error ke frontend atau log
            return response()->json(['success' => false, 'message' => 'Terjadi error saat menyimpan data', 'error' => $e->getMessage()]);
        }
    }
    public function removeDataPasienMordibitas(array $dataDiagnosa = []){
        // $RegisterData2 = PasienmorbiditasT::where('pasienmorbiditas_id', $dataDiagnosa['pasienmorbiditas_id'])->first();
        $RegisterData = DB::table('pasienmorbiditas_t ')
        ->select(
            DB::raw('pasienmorbiditas_t.*')
        )
        ->from('pasienmorbiditas_t')
        ->where('pasienmorbiditas_t.pasienmorbiditas_id','=', $dataDiagnosa['pasienmorbiditas_id'])
        ->first();

        // dd($dataDiagnosa,$RegisterData);

        // dd($dataDiagnosa);
        // Periksa keberadaan SEP
        //  $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();

        try {        
            $preparedData = (array)$RegisterData;

            $remove = DB::table('pasienmorbiditas_t')
            ->where('pasienmorbiditas_id', $RegisterData->pasienmorbiditas_id)
            ->delete();

            // dd($data);
            Log::info('Data pasienmorbiditasT :', $preparedData);
            
            if ($remove) {
                return response()->json(['success' => true,'message' => 'Data berhasil dihapus'], 200);
            }else{
                return response()->json(['success' => false,'message' => 'Terjadi error saat hapus data'], 500);
            }
            // Cek apakah insert berhasil
            if ($remove ) {
                Log::info('Data berhasil disimpan ke tabel pasienmorbiditas_t');
                return response()->json(['success' => true, 'message' => 'Data berhasil disimpan']);
            } else {
                Log::warning('Proses penyimpanan gagal tanpa error SQL.');
                return response()->json(['success' => false, 'message' => 'Proses penyimpanan gagal']);
            }
        } catch (\Exception $e) {
            // dd($e);
            // Log error jika terjadi exception
            Log::error('Terjadi error saat menyimpan data ke tabel pasienmorbiditas_t', [
                'error' => $e->getMessage(),
                'data' => $preparedData,
            ]);

            // Kembalikan pesan error ke frontend atau log
            return response()->json(['success' => false, 'message' => 'Terjadi error saat menyimpan data', 'error' => $e->getMessage()]);
        }
    }

    public function updateDataPasienMordibitas(array $dataDiagnosa = []){
        // dd($dataDiagnosa);
        $RegisterData = PendaftaranT::where('pendaftaran_id', $dataDiagnosa[0]['pendaftaran_id'])->first();
       //  dd($dataDiagnosa,$RegisterData);

        // dd($dataDiagnosa);
        // Periksa keberadaan SEP
       //  $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();

        try {             
            $preparedData = [];
            foreach ($dataDiagnosa as $key => $row) {
                $morbiditasT = DB::table('pasienmorbiditas_t')->where('pasienmorbiditas_id', $row['pasienmorbiditas_id'])->first();
                    // Check if the record exists before attempting to update it
                if ($morbiditasT) {
                    // Prepare the data to update
                    $insertData = (array)$morbiditasT;
                    // Modify the properties as needed
                    $insertData['pasienmorbiditast_id'] = $morbiditasT->pasienmorbiditas_id;
                    $insertData['update_loginpemakai_id']=  $row['loginpemakai_id'];
                    $insertData['update_time']= date('Y-m-d H:i:s');
                    unset($insertData['pasienmorbiditas_id']);
                    $result = DB::table('pasienmorbiditas_r')->insert( $insertData);


                    // Update the record in the database
                    $updateData =  (array)$morbiditasT;
                    $updateData['update_loginpemakai_id']=  $row['loginpemakai_id'];
                    $updateData['update_time']= date('Y-m-d H:i:s');
                    $updateData['kasusdiagnosa']=  $row['kasusdiagnosa'];
                    $updateData['kelompokdiagnosa_id']=  $row['kelompokdiagnosa_id'];
                    $updateData['diagnosa_id']=  $row['diagnosa_id'];
                    $updateData['pegawai_id']=  $row['pegawai_id'];
                    $updateData['tglmorbiditas']=  $row['tgl_pendaftaran'];
                    array_push($preparedData,$updateData);
                    DB::table('pasienmorbiditas_t')
                        ->where('pasienmorbiditas_id', $row['pasienmorbiditas_id'])
                        ->update($updateData);
                }


            }

            Log::info('Data pasienmorbiditasT :', $preparedData);
            
           if ($result) {
               return response()->json(['success' => true,'message' => 'Data berhasil disimpan'], 200);
           }else{
               return response()->json(['success' => false,'message' => 'Terjadi error saat menyimpan data'], 500);
           }
            // Cek apakah insert berhasil
            if ($result ) {
                Log::info('Data berhasil disimpan ke tabel pasienmorbiditas_t', ['data' => $preparedData]);
                return response()->json(['success' => true, 'message' => 'Data berhasil disimpan']);
            } else {
                Log::warning('Proses penyimpanan gagal tanpa error SQL.', ['data' => $preparedData]);
                return response()->json(['success' => false, 'message' => 'Proses penyimpanan gagal']);
            }
        } catch (\Exception $e) {
           
            // Log error jika terjadi exception
            Log::error('Terjadi error saat menyimpan data ke tabel pasienmorbiditas_t', [
                'error' => $e->getMessage(),
                'data' => $preparedData,
            ]);

            // Kembalikan pesan error ke frontend atau log
            return response()->json(['success' => false, 'message' => 'Terjadi error saat menyimpan data', 'error' => $e->getMessage()]);
        }
    }
}

?>