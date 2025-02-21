<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PasienM extends Model
{
    use HasFactory;

    public static function getPaginatedData(int $limit, int $offset, array $filters = [])
    {
        $query = self::buildBaseQuery();
        $query = self::applyFilters($query, $filters);

        return $query->offset($offset)->limit($limit)->get();
    }

    public static function getTotalItems(array $filters = []): int
    {
        $query = self::buildBaseQuery();
        $query = self::applyFilters($query, $filters);

        return $query->count(); // Menghitung jumlah total setelah filter diterapkan
    }

    private static function buildBaseQuery()
    {
        return DB::table('pasien_m')
            ->join('pendaftaran_t', 'pasien_m.pasien_id', '=', 'pendaftaran_t.pasien_id')
            ->join('pasienadmisi_t', 'pendaftaran_t.pasien_id', '=', 'pasienadmisi_t.pendaftaran_id')
            ->join('propinsi_m', 'pasien_m.propinsi_id', '=', 'propinsi_m.propinsi_id')
            ->join('kabupaten_m', 'pasien_m.kabupaten_id', '=', 'kabupaten_m.kabupaten_id')
            ->join('pegawai_m', 'pendaftaran_t.pegawai_id', '=', 'pegawai_m.pegawai_id')
            ->leftJoin('gelarbelakang_m', 'pegawai_m.gelarbelakang_id', '=', 'gelarbelakang_m.gelarbelakang_id')
            ->leftJoin('sep_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
            ->leftJoin('kelurahan_m', 'pasien_m.kelurahan_id', '=', 'kelurahan_m.kelurahan_id')
            ->leftJoin('asuransipasien_m', 'pendaftaran_t.asuransipasien_id', '=', 'asuransipasien_m.asuransipasien_id')
            ->leftJoin('caramasuk_m', 'pendaftaran_t.caramasuk_id', '=', 'caramasuk_m.caramasuk_id')
            ->leftJoin('golonganumur_m', 'pendaftaran_t.golonganumur_id', '=', 'golonganumur_m.golonganumur_id')
            ->leftJoin('rujukan_t', 'pendaftaran_t.rujukan_id', '=', 'rujukan_t.rujukan_id')
            ->leftJoin('asalrujukan_m', 'rujukan_t.asalrujukan_id', '=', 'asalrujukan_m.asalrujukan_id')
            ->leftJoin('penanggungjawab_m', 'pendaftaran_t.penanggungjawab_id', '=', 'penanggungjawab_m.penanggungjawab_id')
            ->leftJoin('pasienpulang_t', 'pendaftaran_t.pasienpulang_id', '=', 'pasienpulang_t.pasienpulang_id')
            ->join('kecamatan_m', 'pasien_m.kecamatan_id', '=', 'kecamatan_m.kecamatan_id')
            ->leftJoin('pekerjaan_m', 'pasien_m.pekerjaan_id', '=', 'pekerjaan_m.pekerjaan_id')
            ->join('kelaspelayanan_m', 'pendaftaran_t.kelaspelayanan_id', '=', 'kelaspelayanan_m.kelaspelayanan_id')
            ->join('carabayar_m', 'pendaftaran_t.carabayar_id', '=', 'carabayar_m.carabayar_id')
            ->join('jeniskasuspenyakit_m', 'pendaftaran_t.jeniskasuspenyakit_id', '=', 'jeniskasuspenyakit_m.jeniskasuspenyakit_id')
            ->join('penjaminpasien_m', 'pendaftaran_t.penjamin_id', '=', 'penjaminpasien_m.penjamin_id')
            ->join('ruangan_m', 'pasienadmisi_t.ruangan_id', '=', 'ruangan_m.ruangan_id')
            ->join('instalasi_m', 'ruangan_m.instalasi_id', '=', 'instalasi_m.instalasi_id')
            ->select(self::getSelectFields())
            ->whereNull('pendaftaran_t.pasienbatalperiksa_id')
            ->orderBy('pendaftaran_t.pendaftaran_id', 'desc');  // Added order by sep_id desc

            ;
    }

    private static function getSelectFields()
    {
        return [
            'pasien_m.pasien_id',
            'pasien_m.jenisidentitas',
            'pasien_m.no_identitas_pasien',
            'pasien_m.namadepan',
            'sep_t.nosep',
            'pasien_m.nama_pasien',
            'pasien_m.nama_bin',
            'pasien_m.jeniskelamin',
            'pasien_m.tempat_lahir',
            'pasien_m.tanggal_lahir',
            'pasien_m.alamat_pasien',
            'pasien_m.rt',
            'pasien_m.rw',
            'pasien_m.agama',
            'pasien_m.golongandarah',
            'pasien_m.photopasien',
            'pasien_m.alamatemail',
            'pasien_m.statusrekammedis',
            'pasien_m.statusperkawinan',
            'pasien_m.no_rekam_medik',
            'pasien_m.tgl_rekam_medik',
            'propinsi_m.propinsi_id',
            'propinsi_m.propinsi_nama',
            'kabupaten_m.kabupaten_id',
            'kabupaten_m.kabupaten_nama',
            'kelurahan_m.kelurahan_id',
            'kelurahan_m.kelurahan_nama',
            'kecamatan_m.kecamatan_id',
            'kecamatan_m.kecamatan_nama',
            'pendaftaran_t.pendaftaran_id',
            'pekerjaan_m.pekerjaan_id',
            'pekerjaan_m.pekerjaan_nama',
            'pendaftaran_t.no_pendaftaran',
            'pendaftaran_t.tgl_pendaftaran',
            'pendaftaran_t.no_urutantri',
            'pendaftaran_t.transportasi',
            'pendaftaran_t.keadaanmasuk',
            'pendaftaran_t.statusperiksa',
            'pendaftaran_t.statuspasien',
            'pendaftaran_t.kunjungan',
            'pendaftaran_t.alihstatus',
            'pendaftaran_t.byphone',
            'pendaftaran_t.kunjunganrumah',
            'pendaftaran_t.statusmasuk',
            'pendaftaran_t.umur',
            'asuransipasien_m.nokartuasuransi AS no_asuransi',
            'asuransipasien_m.namapemilikasuransi AS namapemilik_asuransi',
            'asuransipasien_m.nomorpokokperusahaan AS nopokokperusahaan',
            'pendaftaran_t.create_time',
            'pendaftaran_t.create_loginpemakai_id',
            'pendaftaran_t.create_ruangan',
            'carabayar_m.carabayar_id',
            'carabayar_m.carabayar_nama',
            'penjaminpasien_m.penjamin_id',
            'penjaminpasien_m.penjamin_nama',
            'caramasuk_m.caramasuk_id',
            'caramasuk_m.caramasuk_nama',
            'pendaftaran_t.shift_id',
            'golonganumur_m.golonganumur_id',
            'golonganumur_m.golonganumur_nama',
            'rujukan_t.no_rujukan',
            'rujukan_t.nama_perujuk',
            'rujukan_t.tanggal_rujukan',
            'rujukan_t.diagnosa_rujukan',
            'asalrujukan_m.asalrujukan_id',
            'asalrujukan_m.asalrujukan_nama',
            'penanggungjawab_m.penanggungjawab_id',
            'penanggungjawab_m.pengantar',
            'penanggungjawab_m.hubungankeluarga',
            'penanggungjawab_m.nama_pj',
            'ruangan_m.ruangan_id',
            'ruangan_m.ruangan_nama',
            'instalasi_m.instalasi_id',
            'instalasi_m.instalasi_nama',
            'jeniskasuspenyakit_m.jeniskasuspenyakit_id',
            'jeniskasuspenyakit_m.jeniskasuspenyakit_nama',
            'kelaspelayanan_m.kelaspelayanan_id',
            'kelaspelayanan_m.kelaspelayanan_nama',
            'pendaftaran_t.rujukan_id',
            'pendaftaran_t.pasienpulang_id',
            'pasienpulang_t.tglpasienpulang',
            'pasien_m.profilrs_id',
            'asuransipasien_m.nopeserta',
            'asuransipasien_m.tglcetakkartuasuransi',
            'asuransipasien_m.kodefeskestk1',
            'asuransipasien_m.nama_feskestk1',
            'asuransipasien_m.masaberlakukartu',
            'asuransipasien_m.nokartukeluarga',
            'asuransipasien_m.nopassport',
            'asuransipasien_m.status_konfirmasi',
            'asuransipasien_m.tgl_konfirmasi',
            'asuransipasien_m.asuransipasien_aktif',
            'pendaftaran_t.sep_id',
            'pasien_m.rhesus',
            DB::raw('CASE WHEN pendaftaran_t.pasienadmisi_id IS NULL THEN pendaftaran_t.pegawai_id ELSE pasienadmisi_t.pegawai_id END AS pegawai_id'),
            DB::raw("
            CASE 
                WHEN pendaftaran_t.pasienadmisi_id IS NULL 
                THEN CONCAT(
                    COALESCE(pegawai_m.gelardepan, ''), ' ', 
                    pegawai_m.nama_pegawai, ' ', 
                    COALESCE(gelarbelakang_m.gelarbelakang_nama, '')
                ) 
                ELSE CONCAT(
                    COALESCE(pegawai_m.gelardepan, ''), ' ', 
                    pegawai_m.nama_pegawai, ' ', 
                    COALESCE(gelarbelakang_m.gelarbelakang_nama, '')
                ) 
            END AS nama_pegawai
        ")            
            ];
    }

    private static function applyFilters($query, $filters)
    {
        foreach ($filters as $key => $value) {
            if (!empty($value)) {
                switch ($key) {
                    case 'nama_pasien':
                        $query->where('pasien_m.nama_pasien', 'like', "%$value%");
                        break;
                    case 'no_rekam_medik':
                        $query->where('pasien_m.no_rekam_medik', 'like', "%$value%");
                        break;
                    case 'tanggal_mulai':
                    case 'tanggal_selesai':
                        if (!empty($filters['tanggal_mulai']) && !empty($filters['tanggal_selesai'])) {
                            $query->whereBetween(DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), [$filters['tanggal_mulai'], $filters['tanggal_selesai']]);
                        }
                        break;
                    case 'carabayar_id':
                        $query->where('pendaftaran_t.carabayar_id', $value);
                        break;
                    case 'no_pendaftaran':
                        $query->where('pendaftaran_t.no_pendaftaran', $value);
                        break;
                    case 'jenisRawat':
                        $query->whereIn('pendaftaran_t.carabayar_id', explode(",", $value));
                        break;
                    case 'jenisPenjamin':
                        $query->whereIn('pendaftaran_t.penjamin_id', explode(",", $value));
                        break;
                    case 'instalasi':
                        $query->whereIn('pendaftaran_t.instalasi_id', explode(",", $value));
                        break;

                    case 'ruangan':
                        $query->whereIn('pasienadmisi_t.ruangan_id', explode(",", $value));
                        break;


                    case 'dokter':
                        $query->whereIn('pendaftaran_t.pegawai_id', explode(",", $value));
                        break;


                    case 'statusperiksa':
                        $query->whereIn('pendaftaran_t.statusperiksa', explode(",", $value));
                        break;
                    case 'kunjungan':
                        $query->whereIn('pendaftaran_t.statuspasien', explode(",", $value));
                        break;

                    default:
                        $query->where($key, $value);
                        break;
                }
            }
        }
        return $query;
    }
}
