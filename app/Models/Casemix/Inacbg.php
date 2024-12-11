<?php 
namespace App\Models\Casemix;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Inacbg extends Model
{
    protected $table = 'inacbg_t';

    /**
     * Hitung total item untuk pagination.
     */
    public static function getTotalItems(): int
    {
        return DB::table('inacbg_t')
        ->leftJoin('pendaftaran_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
        ->leftJoin('sep_t', 'inacbg_t.sep_id', '=', 'sep_t.sep_id')
        ->leftJoin('pasien_m', 'inacbg_t.pasien_id', '=', 'pasien_m.pasien_id')
        ->leftJoin('loginpemakai_k', 'inacbg_t.create_loginpemakai_id', '=', 'loginpemakai_k.loginpemakai_id')
        ->leftJoin('pegawai_m', 'loginpemakai_k.pegawai_id', '=', 'pegawai_m.pegawai_id')
            ->count();
    }

    /**
     * Ambil data untuk ditampilkan dengan pagination.
     */
    public static function getPaginatedData(int $limit, int $offset)
    {
        return DB::table('inacbg_t')
            ->select([
                'pasien_m.nama_pasien',
                'pasien_m.no_rekam_medik',
                'pendaftaran_t.no_pendaftaran',
                'sep_t.nosep',
                'inacbg_t.tglrawat_masuk',
                'inacbg_t.tglrawat_keluar',
                'inacbg_t.jaminan_nama',
                'inacbg_t.is_terkirim',
            ])
            ->leftJoin('pendaftaran_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('sep_t', 'inacbg_t.sep_id', '=', 'sep_t.sep_id')
            ->leftJoin('pasien_m', 'inacbg_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->leftJoin('loginpemakai_k', 'inacbg_t.create_loginpemakai_id', '=', 'loginpemakai_k.loginpemakai_id')
            ->leftJoin('pegawai_m', 'loginpemakai_k.pegawai_id', '=', 'pegawai_m.pegawai_id')
            ->offset($offset)
            ->limit($limit)
            ->get();
    }
}
