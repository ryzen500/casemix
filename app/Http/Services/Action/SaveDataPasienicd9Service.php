<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\Pasienicd9cmT;
use App\Models\PasienmorbiditasT;
use App\Models\PendaftaranT;
// use DB;
use Exception;
use Log;
use Illuminate\Support\Facades\DB;

class SaveDataPasienicd9Service
{


    /**
     * Function to save
     */

    public function addDataPasienicd9T(array $dataDiagnosa = []){
         $RegisterData = PendaftaranT::where('pendaftaran_id', $dataDiagnosa['pendaftaran_id'])->first();

         // dd($dataDiagnosa);
         // Periksa keberadaan SEP
        //  $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();
        $preparedData = [];

        $konfig = DB::table('konfigsystem_k')->first();
        if($konfig->is_updatediagnosacasemix){
            try {             
                $preparedData = [
                    'pendaftaran_id' => $RegisterData['pendaftaran_id'] ?? null,
                    'pegawai_id' => $dataDiagnosa['pegawai_id'] ?? null,
                    'diagnosaicdix_id' => $dataDiagnosa['diagnosaicdix_id'] ?? null,
                    'tglmorbiditas' => $dataDiagnosa['tgl_pendaftaran'] ?? null, // Tambahkan tanggal saat ini
                    // 'ruangan_id' => $RegisterData['ruangan_id'] ?? null, // Tambahkan tanggal saat ini
                    'create_time' => date('Y-m-d H:i:s'), // Tambahkan tanggal saat ini
                    'create_loginpemakai_id' => $dataDiagnosa['loginpemakai_id'], // Tambahkan tanggal saat ini
                    'create_ruangan_id' => 429,
                    'kelompokdiagnosa_id' => $dataDiagnosa['kelompokdiagnosa_id'] ?? null,
                    // Tambahkan field lain sesuai kebutuhan
                ];

                $result = DB::table('pasienicd9cm_t')->insert( $preparedData);
                $data = Pasienicd9cmT::getIcdIXdesc($RegisterData['pendaftaran_id']);

                // dd($data);
                Log::info('Data Pasienicd9cmT :', $preparedData);
                
                if ($result) {
                    return response()->json(['success' => true,'message' => 'Data berhasil disimpan','Pasienicd9cmT'=>$data], 200);
                }else{
                    return response()->json(['success' => false,'message' => 'Terjadi error saat menyimpan data'], 500);
                }
                // Cek apakah insert berhasil
                if ($result ) {
                    Log::info('Data berhasil disimpan ke tabel Pasienicd9cmT', ['data' => $dataDiagnosa]);
                    return response()->json(['success' => true, 'message' => 'Data berhasil disimpan']);
                } else {
                    Log::warning('Proses penyimpanan gagal tanpa error SQL.', ['data' => $dataDiagnosa]);
                    return response()->json(['success' => false, 'message' => 'Proses penyimpanan gagal']);
                }
            } catch (\Exception $e) {
                
                // Log error jika terjadi exception
                Log::error('Terjadi error saat menyimpan data ke tabel Pasienicd9cmT', [
                    'error' => $e->getMessage(),
                    'data' => $preparedData,
                ]);
    
                // Kembalikan pesan error ke frontend atau log
                return response()->json(['success' => false, 'message' => 'Terjadi error saat menyimpan data', 'error' => $e->getMessage()]);
            }
        }else{
            $preparedData = [
                'pendaftaran_id' => $RegisterData['pendaftaran_id'] ?? null,
                'pegawai_id' => $dataDiagnosa['pegawai_id'] ?? null,
                'diagnosaicdix_id' => $dataDiagnosa['diagnosaicdix_id'] ?? null,
                'tglmorbiditas' => $dataDiagnosa['tgl_pendaftaran'] ?? null, // Tambahkan tanggal saat ini
                // 'ruangan_id' => $RegisterData['ruangan_id'] ?? null, // Tambahkan tanggal saat ini
                'create_time' => date('Y-m-d H:i:s'), // Tambahkan tanggal saat ini
                'create_loginpemakai_id' => $dataDiagnosa['loginpemakai_id'], // Tambahkan tanggal saat ini
                'create_ruangan_id' => 429,
                'kelompokdiagnosa_id' => $dataDiagnosa['kelompokdiagnosa_id'] ?? null,
                'pasienicd9cm_id' =>null
                // Tambahkan field lain sesuai kebutuhan
            ];
            return response()->json(['success' => true,'message' => 'Data berhasil disimpan','Pasienicd9cmT'=>$preparedData], 200);

        }
    }
 
    public function addDataPasienicd9R(array $dataDiagnosa = []){

        // $RegisterData2 = PasienmorbiditasT::where('pasienmorbiditas_id', $dataDiagnosa['pasienmorbiditas_id'])->first();
        if(!empty($dataDiagnosa['pasienicd9cm_id'])){
            $RegisterData = DB::table('pasienicd9cm_t ')
            ->select(
                DB::raw('pasienicd9cm_t.*')
            )
            ->from('pasienicd9cm_t')
            ->where('pasienicd9cm_t.pasienicd9cm_id','=', $dataDiagnosa['pasienicd9cm_id'])
            ->first();
        }else{
            $RegisterData =[];
        }
        

        // dd($dataDiagnosa);
        // Periksa keberadaan SEP
       //  $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();
        $konfig = DB::table('konfigsystem_k')->first();
        if($konfig->is_updatediagnosacasemix){
            try {        
            $preparedData = (array)$RegisterData;
                // Modify the properties as needed
                $preparedData['pasienicd9cmt_id'] = $RegisterData->pasienicd9cm_id;
                $preparedData['update_loginpemakai_id']= $dataDiagnosa['update_loginpemakai_id'];
                $preparedData['update_time']= date('Y-m-d H:i:s');
                unset($preparedData['pasienicd9cm_id']);

                $result = DB::table('pasienicd9cm_r')->insert( $preparedData);
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
        }else{
            return response()->json(['success' => true,'message' => 'Data berhasil dihapus'], 200);
        }
    }
    public function removeDataPasienicd9T(array $dataDiagnosa = []){
        // $RegisterData2 = PasienmorbiditasT::where('pasienmorbiditas_id', $dataDiagnosa['pasienmorbiditas_id'])->first();
        if(!empty($dataDiagnosa['pasienicd9cm_id'])){

            $RegisterData = DB::table('pasienicd9cm_t ')
            ->select(
                DB::raw('pasienicd9cm_t.*')
            )
            ->from('pasienicd9cm_t')
            ->where('pasienicd9cm_t.pasienicd9cm_id','=', $dataDiagnosa['pasienicd9cm_id'])
            ->first();
        }else{
            $RegisterData=[];
        }

        // dd($dataDiagnosa,$RegisterData);

        // dd($dataDiagnosa);
        // Periksa keberadaan SEP
        //  $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();
        $konfig = DB::table('konfigsystem_k')->first();
        if($konfig->is_updatediagnosacasemix){
            try {        
                $preparedData = (array)$RegisterData;

                $remove = DB::table('pasienicd9cm_t')
                ->where('pasienicd9cm_id', $RegisterData->pasienicd9cm_id)
                ->delete();

                // dd($data);
                Log::info('Data pasienicd9cm_t :', $preparedData);
                
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
        }else{
            return response()->json(['success' => true,'message' => 'Data berhasil dihapus'], 200);
        }
    }

    public function updateDataPasienicd9(array $dataDiagnosa = []){
        // dd($dataDiagnosa);
        $RegisterData = PendaftaranT::where('pendaftaran_id', $dataDiagnosa[0]['pendaftaran_id'])->first();

       //  dd($dataDiagnosa,$RegisterData);

        // dd($dataDiagnosa);
        // Periksa keberadaan SEP
       //  $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();
       $preparedData = [];

       $konfig = DB::table('konfigsystem_k')->first();
       if($konfig->is_updatediagnosacasemix){
            try {             
                $preparedData = [];
                foreach ($dataDiagnosa as $key => $row) {
                    $pasienicd9cmT = DB::table('pasienicd9cm_t')->where('pasienicd9cm_id', $row['pasienicd9cm_id'])->first();

                        // Check if the record exists before attempting to update it
                    if ($pasienicd9cmT) {
                        // Prepare the data to update
                        $insertData = (array)$pasienicd9cmT;
                        // Modify the properties as needed
                        $insertData['pasienicd9cmt_id'] = $pasienicd9cmT->pasienicd9cm_id;
                        $insertData['update_loginpemakai_id']=  $row['loginpemakai_id'];
                        $insertData['update_time']= date('Y-m-d H:i:s');
                        unset($insertData['pasienicd9cm_id']);
                        $result = DB::table('pasienicd9cm_r')->insert( $insertData);

                        // Update the record in the database
                        $updateData =  (array)$pasienicd9cmT;
                        $updateData['update_loginpemakai_id']=  $row['loginpemakai_id'];
                        $updateData['update_time']= date('Y-m-d H:i:s');
                        $updateData['diagnosaicdix_id']=  $row['diagnosaicdix_id'];
                        array_push($preparedData,$updateData);
                        DB::table('pasienicd9cm_t')
                            ->where('pasienicd9cm_id', $row['pasienicd9cm_id'])
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
       }else{
        // dd($konfig->is_updatediagnosacasemix,$dataDiagnosa);
        foreach ($dataDiagnosa as $key => $row) {
            array_push($preparedData,$row);
        }

        return response()->json(['success' => true,'message' => 'Data berhasil disimpan','data'=>$preparedData], 200);

    }
    }
}

?>