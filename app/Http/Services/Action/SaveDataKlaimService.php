<?php

namespace App\Http\Services\Action;

use App\Models\Casemix\Inacbg;
use App\Models\PasienMordibitasR;
use App\Models\PendaftaranT;
use DB;
use Exception;
use Log;

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
                'jaminan_id' => !empty($pendaftaran['carabayar_id']) && $pendaftaran['carabayar_id'] !== '' ? $pendaftaran['carabayar_id'] : null,
                'jaminan_nama' => $pendaftaran['carabayar_nama'] ?? null,
                'inacbg_nosep' => $data['nomor_sep'] ?? null,
                'sep_id' => !empty($pendaftaran['sep_id']) && $pendaftaran['sep_id'] !== '' ? $pendaftaran['sep_id'] : null,
                'pasien_id' => !empty($RegisterData['pasien_id']) ? $RegisterData['pasien_id'] : null,
                'pendaftaran_id' => !empty($RegisterData['pendaftaran_id']) ? $RegisterData['pendaftaran_id'] : null,
                'inacbg_tgl' => date("Y-m-d H:i:s"),
                'kodeinacbg' => 'AB',
                'tarifgruper' => 0,
                'totaltarif' =>  !empty($pendaftaran['total_tarif_rs']) ? $pendaftaran['total_tarif_rs'] : 0,
                'total_tarif_rs'=>!empty($pendaftaran['total_tarif_rs']) ? $pendaftaran['total_tarif_rs'] : 0,
                'tarif_prosedur_nonbedah' => !empty($data['prosedur_non_bedah']) ? $data['prosedur_non_bedah'] : 0,
                'tarif_prosedur_bedah' => !empty($data['prosedur_bedah']) ? $data['prosedur_bedah'] : 0,
                'tarif_konsultasi' => !empty($data['konsultasi']) ? $data['konsultasi'] : 0,
                'tarif_tenaga_ahli' => !empty($data['tenaga_ahli']) ? $data['tenaga_ahli'] : 0,
                'tarif_keperawatan' => !empty($data['keperawatan']) ? $data['keperawatan'] : 0,
                'tarif_penunjang' => !empty($data['penunjang']) ? $data['penunjang'] : 0,
                'tarif_radiologi' => !empty($data['radiologi']) ? $data['radiologi'] : 0,
                'tarif_laboratorium' => !empty($data['laboratorium']) ? $data['laboratorium'] : 0,
                'tarif_pelayanan_darah' => !empty($data['pelayanan_darah']) ? $data['pelayanan_darah'] : 0,
                'tarif_rehabilitasi' => !empty($data['rehabilitasi']) ? $data['rehabilitasi'] : 0,
                'tarif_akomodasi' => !empty($data['kamar']) ? $data['kamar'] : 0,
                'tarif_rawat_integerensif' => !empty($data['rawat_intensif']) ? $data['rawat_intensif'] : 0,
                'tarif_obat' => !empty($data['obat']) ? $data['obat'] : 0,
                'tarif_obat_kronis' => !empty($data['obat_kronis']) ? $data['obat_kronis'] : 0,
                'tarif_obat_kemoterapi' => !empty($data['obat_kemoterapi']) ? $data['obat_kemoterapi'] : 0,
                'tarif_alkes' => !empty($data['alkes']) ? $data['alkes'] : 0,
                'tarif_bhp' => !empty($data['bmhp']) ? $data['bmhp'] : 0,
                'tarif_sewa_alat' => !empty($data['sewa_alat']) ? $data['sewa_alat'] : 0,
                'ruanganakhir_id' => !empty($RegisterData['ruangan_id']) ? $RegisterData['ruangan_id'] : null,
                'create_ruangan_id' => 429,
                'cob_id' => $data['cob_cd'] ?? null,
                'jenisrawat_inacbg' => !empty($data['jenis_rawat']) && $data['jenis_rawat'] !== '' ? $data['jenis_rawat'] : null,
                'tglrawat_masuk' => $data['tgl_masuk'] ?? null,
                'tglrawat_keluar' => $data['tgl_pulang'] ?? null,
                'hak_kelasrawat_inacbg' => !empty($data['kelas_rawat']) && $data['kelas_rawat'] !== '' ? $data['kelas_rawat'] : null,
                'umur_pasien' => !empty($pendaftaran['umur_pasien']) && $pendaftaran['umur_pasien'] !== '' ? $pendaftaran['umur_pasien'] : null,
                'create_time' => date("Y-m-d H:i:s"),
                'create_loginpemakai_id' => !empty($pendaftaran['create_loginpemakai_id']) && $pendaftaran['create_loginpemakai_id'] !== '' ? $pendaftaran['create_loginpemakai_id'] : null,
                'create_ruangan' => 429,
                'create_tanggal' => date("Y-m-d H:i:s"),
                'create_coder_nik' => $data['coder_nik'] ?? null,
                'nama_dpjp' => $data['nama_dokter'] ?? null,
            ];

            if ($SEP) {
                // Jika SEP ditemukan, lakukan update
                $SEP->update($inacbgData);
                $message = 'Data berhasil diperbarui';
                \Log::info('Data yang akan diupdate:', $inacbgData);

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


    /**
     * Function to save PasienMordibitas
     */

    public function addDataPasienMordibitasRiwayat(array $data = [], array $pendaftaran = [], array $dataDiagnosa = [])
    {
        $RegisterData = PendaftaranT::where('sep_id', $pendaftaran['sep_id'])->first();



        //  dd($dataDiagnosa);

        // Periksa keberadaan SEP
        $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();

        try {
            // Konversi elemen $dataDiagnosa ke array jika berupa objek
            $dataDiagnosa = array_map(function ($item) {
                return (array) $item;
            }, $dataDiagnosa);
            // Lakukan insert batch ke tabel
            $result = DB::table('pasienmorbiditas_r')->insert($dataDiagnosa);

            // Cek apakah insert berhasil
            if ($result) {
                Log::info('Data berhasil disimpan ke tabel pasienmorbiditas_r', ['data' => $dataDiagnosa]);
                return response()->json(['success' => true, 'message' => 'Data berhasil disimpan']);
            } else {
                Log::warning('Proses penyimpanan gagal tanpa error SQL.', ['data' => $dataDiagnosa]);
                return response()->json(['success' => false, 'message' => 'Proses penyimpanan gagal']);
            }
        } catch (\Exception $e) {
            // Log error jika terjadi exception
            Log::error('Terjadi error saat menyimpan data ke tabel pasienmorbiditas_r', [
                'error' => $e->getMessage(),
                'data' => $dataDiagnosa,
            ]);

            // Kembalikan pesan error ke frontend atau log
            return response()->json(['success' => false, 'message' => 'Terjadi error saat menyimpan data', 'error' => $e->getMessage()]);
        }
    }



    /**
     * Function to Delete PasienMordibitas
     */

    public function DeleteDataPasienMordibitas(array $data = [], array $pendaftaran = [], array $dataDiagnosa = [])
    {
        $RegisterData = PendaftaranT::where('sep_id', $pendaftaran['sep_id'])->first();

        // Periksa keberadaan SEP
        $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();

        try {
            // Konversi elemen $dataDiagnosa ke array jika berupa objek
            $dataDiagnosa = array_map(function ($item) {
                return (array) $item;
            }, $dataDiagnosa);

            // Ambil semua pasienmorbiditas_id dari $dataDiagnosa
            $pasienMorbiditasIds = array_column($dataDiagnosa, 'pasienmorbiditas_id');

            // Validasi apakah ID tersedia
            if (empty($pasienMorbiditasIds)) {
                return response()->json(['success' => false, 'message' => 'Tidak ada pasienmorbiditas_id yang diberikan']);
            }

            // Hapus data berdasarkan pasienmorbiditas_id
            $result = DB::table('pasienmorbiditas_t')
                ->whereIn('pasienmorbiditas_id', $pasienMorbiditasIds)
                ->delete();

            // Cek apakah delete berhasil
            if ($result > 0) {
                Log::info('Data berhasil dihapus dari tabel pasienmorbiditas_t', ['deleted_ids' => $pasienMorbiditasIds]);
                return response()->json(['success' => true, 'message' => 'Data berhasil dihapus']);
            } else {
                Log::warning('Tidak ada data yang dihapus. Periksa ID yang diberikan.', ['ids' => $pasienMorbiditasIds]);
                return response()->json(['success' => false, 'message' => 'Tidak ada data yang dihapus']);
            }
        } catch (\Exception $e) {
            // Log error jika terjadi exception
            Log::error('Terjadi error saat menghapus data dari tabel pasienmorbiditas_r', [
                'error' => $e->getMessage(),
                'data' => $dataDiagnosa,
            ]);

            // Kembalikan pesan error ke frontend atau log
            return response()->json(['success' => false, 'message' => 'Terjadi error saat menghapus data', 'error' => $e->getMessage()]);
        }
    }

    public function addDataPasienMordibitas(array $data = [], array $pendaftaran = [], array $dataDiagnosa = [])
    {
        $RegisterData = PendaftaranT::where('sep_id', $pendaftaran['sep_id'])->first();



        //  dd($dataDiagnosa);

        // Periksa keberadaan SEP
        $SEP = Inacbg::where('inacbg_nosep', $data['nomor_sep'])->first();

        try {

            $preparedData = []; // Array untuk menampung data yang sudah dimodifikasi

            foreach ($dataDiagnosa as $item) {
                // Konversi setiap item menjadi array (jika bukan array)
                $item = (array) $item;

                // Manipulasi atau filter data sesuai kebutuhan
                // Misalnya: hanya ambil field tertentu
                $preparedData[] = [
                    'pasien_id' => $RegisterData['pasien_id'] ?? null,
                    'pendaftaran_id' => $RegisterData['pendaftaran_id'] ?? null,
                    'pegawai_id' => $item['pegawai_id'] ?? null,
                    'diagnosa_id' => $item['diagnosa_id'] ?? null,
                    'tglmorbiditas' => $item['tgl_pendaftaran'] ?? null, // Tambahkan tanggal saat ini
                    'kasusdiagnosa' => $item['kasusdiagnosa'] ?? null, // Tambahkan tanggal saat ini
                    'ruangan_id' => $RegisterData['ruangan_id'] ?? null, // Tambahkan tanggal saat ini
                    'create_time' => date('Y-m-d H:i:s'), // Tambahkan tanggal saat ini
                    'create_loginpemakai_id' => 1, // Tambahkan tanggal saat ini
                    'create_ruangan'=>429,
                    'kelompokdiagnosa_id'=>$item['kelompokdiagnosa_id'] ?? null,
                    'jeniskasuspenyakit_id'=>$RegisterData['jeniskasuspenyakit_id'] ?? null,
                    'kelompokumur_id'=>1,
                    'golonganumur_id'=>1,
                    // Tambahkan field lain sesuai kebutuhan
                ];
            }

            // Lakukan insert batch ke tabel
            if (!empty($preparedData)) {
                $result = DB::table('pasienmorbiditas_t')->insert($preparedData);

                if ($result) {
                    return response()->json(['message' => 'Data berhasil disimpan'], 200);
                }
            }
            // Cek apakah insert berhasil
            if ($result) {
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
                'data' => $dataDiagnosa,
            ]);

            // Kembalikan pesan error ke frontend atau log
            return response()->json(['success' => false, 'message' => 'Terjadi error saat menyimpan data', 'error' => $e->getMessage()]);
        }
    }
}

?>