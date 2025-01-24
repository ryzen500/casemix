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
        $RegisterData = PendaftaranT::where('sep_id', $pendaftaran['sep_id'])->first();

        // Periksa keberadaan SEP
        $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();

        try {
            $inacbgData = [
                'jaminan_id' => isset($pendaftaran['carabayar_id']) && $pendaftaran['carabayar_id'] !== '' ? $pendaftaran['carabayar_id'] : null,
                'jaminan_nama' => $pendaftaran['carabayar_nama'] ?? null,
                'inacbg_nosep' => $data['nomor_sep'] ?? null,
                'sep_id' => isset($pendaftaran['sep_id']) && $pendaftaran['sep_id'] !== '' ? $pendaftaran['sep_id'] : null,
                'pasien_id' => isset($RegisterData['pasien_id']) ? $RegisterData['pasien_id'] : null,
                'pendaftaran_id' => isset($RegisterData['pendaftaran_id']) ? $RegisterData['pendaftaran_id'] : null,
                'inacbg_tgl' => date("Y-m-d H:i:s"),
                'kodeinacbg' => 'AB',
                'tarifgruper' => 0,
                'totaltarif' => 0,
                'tarif_prosedur_nonbedah' => $data['prosedur_non_bedah'] ?? 0,
                'tarif_prosedur_bedah' => $data['prosedur_bedah'] ?? 0,
                'tarif_konsultasi' => $data['konsultasi'] ?? 0,
                'tarif_tenaga_ahli' => $data['tenaga_ahli'] ?? 0,
                'tarif_keperawatan' => $data['keperawatan'] ?? 0,
                'tarif_penunjang' => $data['penunjang'] ?? 0,
                'tarif_radiologi' => $data['penunjang'] ?? 0,
                'tarif_laboratorium' => $data['laboratorium'] ?? 0,
                'tarif_pelayanan_darah' => $data['pelayanan_darah'] ?? 0,
                'tarif_rehabilitasi' => $data['rehabilitasi'] ?? 0,
                'tarif_akomodasi' => $data['kamar'] ?? 0,
                'tarif_rawat_integerensif' => $data['rawat_intensif'] ?? 0,
                'tarif_obat' => $data['obat'] ?? 0,
                'tarif_obat_kronis' => $data['obat_kronis'] ?? 0,
                'tarif_obat_kemoterapi' => $data['obat_kemoterapi'] ?? 0,
                'tarif_alkes' => $data['alkes'] ?? 0,
                'tarif_bhp' => $data['bmhp'] ?? 0,
                'tarif_sewa_alat' => $data['sewa_alat'] ?? 0,
                'ruanganakhir_id' => isset($RegisterData['ruangan_id']) ? $RegisterData['ruangan_id'] : null,
                'create_ruangan_id' => 429,
                'cob_id' => $data['cob_cd'] ?? null,
                'jenisrawat_inacbg' => isset($data['jenis_rawat']) && $data['jenis_rawat'] !== '' ? $data['jenis_rawat'] : null,
                'tglrawat_masuk' => $data['tgl_masuk'] ?? null,
                'tglrawat_keluar' => $data['tgl_pulang'] ?? null,
                'hak_kelasrawat_inacbg' => isset($data['kelas_rawat']) && $data['kelas_rawat'] !== '' ? $data['kelas_rawat'] : null,
                'umur_pasien' => isset($pendaftaran['umur_pasien']) && $pendaftaran['umur_pasien'] !== '' ? $pendaftaran['umur_pasien'] : null,
                'create_time' => date("Y-m-d H:i:s"),
                'create_loginpemakai_id' => isset($pendaftaran['create_loginpemakai_id']) && $pendaftaran['create_loginpemakai_id'] !== '' ? $pendaftaran['create_loginpemakai_id'] : null,
                'create_ruangan' => 429,
                'create_tanggal' => date("Y-m-d H:i:s"),
                'create_coder_nik' => $data['coder_nik'] ?? null,
                'nama_dpjp' => $data['nama_dokter'] ?? null,
            ];

            if ($SEP) {
                // Jika SEP ditemukan, lakukan update
                $SEP->update($inacbgData);
                $message = 'Data berhasil diperbarui';
            } else {
                // Jika SEP tidak ditemukan, lakukan create
                Inacbg::create($inacbgData);
                $message = 'Data berhasil disimpan';
            }

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