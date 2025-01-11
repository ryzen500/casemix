<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PasienPulangT extends Model
{
    use HasFactory;

    protected $table = 'pasienpulang_t';

    public $timestamps = false; // Set to true if timestamps exist

    /**
     * Summary of fillable (Attributes from entity pasienpulang_t )
     * @var array
     */
    protected $fillable = ['pasienbatalpulang_id', 'pendaftarran_id', 'pasienadmisi_id', 'carakeluar_id', 'kondisikeluar_id', 'tglpasienpulang', 'ruanganakhir_id', 'penerimapasien', 'lamarawat', 'satuanlamarawat', 'ismeninggal', 'keterangankeluar'];


    /**
     * Functions
     */

    //list laporandetailpasienpulang 

    public function list()
    {
        $query = DB::table('pasienpulang_t')
            ->join('pasien_m', 'pasienpulang_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->join('pendaftaran_t', 'pasienpulang_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->join('ruangan_m', 'pasienpulang_t.ruanganakhir_id', '=', 'ruangan_m.ruangan_id')
            ->join('instalasi_m', 'ruangan_m.instalasi_id', '=', 'instalasi_m.instalasi_id')
            ->join('jeniskasuspenyakit_m', 'pendaftaran_t.jeniskasuspenyakit_id', '=', 'jeniskasuspenyakit_m.jeniskasuspenyakit_id')
            ->leftJoin('carakeluar_m', 'pasienpulang_t.carakeluar_id', '=', 'carakeluar_m.carakeluar_id')
            ->leftJoin('kondisikeluar_m', 'pasienpulang_t.kondisikeluar_id', '=', 'kondisikeluar_m.kondisikeluar_id')
            ->leftJoin('asuransipasien_m', 'pendaftaran_t.asuransipasien_id', '=', 'asuransipasien_m.asuransipasien_id')
            ->leftJoin('pasienadmisi_t', 'pendaftaran_t.pasienadmisi_id', '=', 'pasienadmisi_t.pasienadmisi_id')
            ->leftJoin('sep_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
            ->join('carabayar_m', function ($join) {
                $join->on('carabayar_m.carabayar_id', '=', DB::raw('CASE WHEN pasienpulang_t.pasienadmisi_id IS NOT NULL THEN pasienadmisi_t.carabayar_id ELSE pendaftaran_t.carabayar_id END'));
            })
            ->join('penjaminpasien_m', function ($join) {
                $join->on('penjaminpasien_m.penjamin_id', '=', DB::raw('CASE WHEN pasienpulang_t.pasienadmisi_id IS NOT NULL THEN pasienadmisi_t.penjamin_id ELSE pendaftaran_t.penjamin_id END'));
            })
            ->join('pegawai_m', function ($join) {
                $join->on('pegawai_m.pegawai_id', '=', DB::raw('CASE WHEN pasienpulang_t.pasienadmisi_id IS NOT NULL THEN pasienadmisi_t.pegawai_id ELSE pendaftaran_t.pegawai_id END'));
            })
            ->whereNull('pasienpulang_t.pasienbatalpulang_id')
            ->select([
                'pasien_m.pasien_id',
                'pasien_m.jenisidentitas',
                'pasien_m.no_identitas_pasien',
                'pasien_m.namadepan',
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
                'pendaftaran_t.pendaftaran_id',
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
                'pendaftaran_t.pasienadmisi_id',
                'pasienadmisi_t.tgladmisi',
                'pasienadmisi_t.carabayar_id',
                'pasienadmisi_t.penjamin_id',
                'asuransipasien_m.nokartuasuransi as no_asuransi',
                'asuransipasien_m.namapemilikasuransi as namapemilik_asuransi',
                'asuransipasien_m.nomorpokokperusahaan as nopokokperusahaan',
                'pendaftaran_t.create_time',
                'pendaftaran_t.create_loginpemakai_id',
                'pendaftaran_t.create_ruangan',
                'pendaftaran_t.shift_id',
                'pendaftaran_t.sep_id',
                'sep_t.nosep',
                'ruangan_m.ruangan_id',
                'ruangan_m.ruangan_nama',
                'instalasi_m.instalasi_id',
                'instalasi_m.instalasi_nama',
                'jeniskasuspenyakit_m.jeniskasuspenyakit_id',
                'jeniskasuspenyakit_m.jeniskasuspenyakit_nama',
                'pasienpulang_t.pasienpulang_id',
                'pasienpulang_t.tglpasienpulang',
                'sep_t.tgl_meninggal',
                'sep_t.nosurat_ketmeninggal',
                'carakeluar_m.carakeluar_id',
                'carakeluar_m.carakeluar_nama as carakeluar',
                'kondisikeluar_m.kondisikeluar_id',
                'kondisikeluar_m.kondisikeluar_nama as kondisipulang',
                'asuransipasien_m.tglcetakkartuasuransi',
                'asuransipasien_m.kodefeskestk1',
                'asuransipasien_m.nama_feskestk1',
                'asuransipasien_m.masaberlakukartu',
                'asuransipasien_m.nokartukeluarga',
                'asuransipasien_m.nopassport',
                'asuransipasien_m.status_konfirmasi',
                'asuransipasien_m.tgl_konfirmasi',
                'asuransipasien_m.asuransipasien_aktif',
                'carabayar_m.carabayar_nama',
                'penjaminpasien_m.penjamin_nama',
                'pegawai_m.pegawai_id',
                'pegawai_m.nama_pegawai'
            ])
            ->get();
        return $query;
    }

    public static function getPaginatedData(int $limit, int $offset, array $filters = [])
    {
        $query = DB::table('pasienpulang_t')
            ->join('pasien_m', 'pasienpulang_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->join('pendaftaran_t', 'pasienpulang_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->join('ruangan_m', 'pasienpulang_t.ruanganakhir_id', '=', 'ruangan_m.ruangan_id')
            ->join('instalasi_m', 'ruangan_m.instalasi_id', '=', 'instalasi_m.instalasi_id')
            ->leftJoin('carakeluar_m', 'pasienpulang_t.carakeluar_id', '=', 'carakeluar_m.carakeluar_id')
            ->leftJoin('kondisikeluar_m', 'pasienpulang_t.kondisikeluar_id', '=', 'kondisikeluar_m.kondisikeluar_id')
            ->leftJoin('pasienadmisi_t', 'pasienpulang_t.pasienadmisi_id', '=', 'pasienadmisi_t.pasienadmisi_id')
            ->join('carabayar_m', function ($join) {
                $join->on('carabayar_m.carabayar_id', '=', DB::raw('CASE WHEN pasienpulang_t.pasienadmisi_id IS NOT NULL THEN pasienadmisi_t.carabayar_id ELSE pendaftaran_t.carabayar_id END'));
            })
            ->whereNull('pasienpulang_t.pasienbatalpulang_id')
            ->select([
                'pasien_m.nama_pasien',
                'pendaftaran_t.no_pendaftaran',
                'ruangan_m.ruangan_nama',
                'instalasi_m.instalasi_nama',
                'carakeluar_m.carakeluar_nama',
                'kondisikeluar_m.kondisikeluar_nama'
            ]);

        // Terapkan filter dinamis
        foreach ($filters as $key => $value) {
            if (!empty($value)) {
                if ($key === 'nama_pasien') {
                    $query->where('pasien_m.nama_pasien', 'like', "%$value%");
                } else {
                    $query->where($key, $value);
                }
            }
        }

        return $query->offset($offset)->limit($limit)->get();
    }

    public static function getTotalItems(array $filters = []): int
    {
        $query = DB::table('pasienpulang_t')
            ->join('pasien_m', 'pasienpulang_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->join('pendaftaran_t', 'pasienpulang_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->whereNull('pasienpulang_t.pasienbatalpulang_id');

        // Terapkan filter dinamis
        foreach ($filters as $key => $value) {
            if (!empty($value)) {
                if ($key === 'nama_pasien') {
                    $query->where('pasien_m.nama_pasien', 'like', "%$value%");
                } else {
                    $query->where($key, $value);
                }
            }
        }

        return $query->count();
    }


}
