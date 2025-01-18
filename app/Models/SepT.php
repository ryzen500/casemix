<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SepT extends Model
{
    use HasFactory;

    public static function getSep( $nosep)
    {
        // $query = self::buildBaseQueryGrouping();
        $query = DB::table('sep_t as s')
                ->select(
                    DB::raw('p.pendaftaran_id, s.*'),
                    DB::raw("CASE
                        WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim'::text
                        WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN 'Final'::text
                        WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN '-'::text
                        ELSE '-'::text
                        END AS status"),
                    DB::raw('pg.nama_pegawai, inasiscbg_t.kodeprosedur AS cbg'),
                    DB::raw('pm.nama_pasien, pm.no_rekam_medik,pm.jeniskelamin,pm.tanggal_lahir')

                )
                ->join('pendaftaran_t as p', 's.sep_id', '=', 'p.sep_id')
                ->join('pasien_m as pm', 'pm.pasien_id', '=', 'p.pasien_id')
                ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 'p.sep_id')
                ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
                ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
                ->where('s.nosep', $nosep);
                // ->where('s.nosep', '=', "'".$nosep."'");
        return $query->first();

    }
}
