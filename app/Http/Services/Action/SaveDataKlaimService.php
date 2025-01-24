<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\PendaftaranT;
use Exception;

class SaveDataKlaimService
{


    /**
     * Function to save
     */

    public function addDataInacbgT(array $data = [], array $pendaftaran = [])
    {

        $RegisterData  = PendaftaranT::where('sep_id', $pendaftaran['sep_id'])->first();

        // dd($RegisterData['pasien_id']);
        try {
            // Simpan data klaim ke database
            $inacbgData = [
                'jaminan_id' => isset($pendaftaran['carabayar_id']) && $pendaftaran['carabayar_id'] !== '' ? $pendaftaran['carabayar_id'] : null,
                'jaminan_nama' => $pendaftaran['carabayar_nama'] ?? null,
                'inacbg_nosep' => $data['nomor_sep'] ?? null,
                'sep_id' => isset($pendaftaran['sep_id']) && $pendaftaran['sep_id'] !== '' ? $pendaftaran['sep_id'] : null,
                'pasien_id' => isset($RegisterData['pasien_id']) ? $RegisterData['pasien_id'] : null,
                'pendaftaran_id' => isset($RegisterData['pendaftaran_id']) ? $RegisterData['pendaftaran_id'] : null,
                'inacbg_tgl' => date("Y-m-d H:i:s"),
                'kodeinacbg'=>'AB',
                'tarifgruper'=>0,
                'totaltarif'=>0,
                'ruanganakhir_id'=>429,
                'create_ruangan_id'=>429,
                'cob_id' => 1,
                'jenisrawat_inacbg' => isset($data['jenis_rawat']) && $data['jenis_rawat'] !== '' ? $data['jenis_rawat'] : null,
                'tglrawat_masuk' => $data['tgl_masuk'] ?? null,
                'tglrawat_keluar' => $data['tgl_pulang'] ?? null,
                'hak_kelasrawat_inacbg' => isset($data['kelas_rawat']) && $data['kelas_rawat'] !== '' ? $data['kelas_rawat'] : null,
                'umur_pasien' => isset($pendaftaran['umur_pasien']) && $pendaftaran['umur_pasien'] !== '' ? $pendaftaran['umur_pasien'] : null,
                'create_time' => date("Y-m-d H:i:s"),
                'create_loginpemakai_id'=>1,
                'create_ruangan'=>429,
                'create_tanggal' => date("Y-m-d H:i:s"),
                'create_coder_nik'=>$data['coder_nik'] ?? null ,
                'nama_dpjp' => $data['nama_dokter'] ?? null,
            ];

            // Simpan data klaim ke database
            Inacbg::create($inacbgData);
            return [
                'status' => 'success',
                'message' => 'Data berhasil disimpan'
            ];
        } catch (Exception $e) {
            return ['status' => 'failed', 'message' => $e->getMessage()];
        }
    }
}

?>