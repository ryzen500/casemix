<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PasienmorbiditasT extends Model
{
    use HasFactory;
    public static function getMorbiditas($pendaftaran_id)
    {
        $query = DB::table('pasienmorbiditas_t ')
        ->select(
            DB::raw('pasienmorbiditas_t.pasienmorbiditas_id,pasienmorbiditas_t.pendaftaran_id,pasienmorbiditas_t.kasusdiagnosa,
            pendaftaran_t.tgl_pendaftaran, pendaftaran_t.pegawai_id,
            diagnosa_m.diagnosa_id,diagnosa_m.diagnosa_nama,diagnosa_m.diagnosa_kode,
            kelompokdiagnosa_m.kelompokdiagnosa_id,kelompokdiagnosa_m.kelompokdiagnosa_nama')
        )
        ->from('pasienmorbiditas_t')
        ->leftJoin('diagnosa_m', 'pasienmorbiditas_t.diagnosa_id',  '=', 'diagnosa_m.diagnosa_id')
        ->leftJoin('kelompokdiagnosa_m', 'pasienmorbiditas_t.kelompokdiagnosa_id',  '=', 'kelompokdiagnosa_m.kelompokdiagnosa_id')
        ->leftJoin('pendaftaran_t', 'pasienmorbiditas_t.pendaftaran_id',  '=', 'pendaftaran_t.pendaftaran_id')

        ->where('pasienmorbiditas_t.pendaftaran_id','=', $pendaftaran_id)
        ->orderBy('kelompokdiagnosa_m.kelompokdiagnosa_id','asc');
// dd($query->toRawSql());
        return $query->get();
    }


    public static function insertMorbiditasByPendaftaran($pendaftaran_id)
    {
        $query = DB::table('pasienmorbiditas_t ')
        ->select(
            DB::raw('pasienmorbiditas_t.pasienmorbiditas_id,pasienmorbiditas_t.jeniskasuspenyakit_id,pasienmorbiditas_t.ruangan_id,pasienmorbiditas_t.pegawai_id,pasienmorbiditas_t.kelompokumur_id,pasienmorbiditas_t.pasien_id,pasienmorbiditas_t.golonganumur_id,pasienmorbiditas_t.tglmorbiditas,pasienmorbiditas_t.kasusdiagnosa,pasienmorbiditas_t.create_time,pasienmorbiditas_t.create_loginpemakai_id,pasienmorbiditas_t.create_ruangan,pasienmorbiditas_t.pendaftaran_id,diagnosa_m.diagnosa_id,kelompokdiagnosa_m.kelompokdiagnosa_id')
        )
        ->from('pasienmorbiditas_t')
        ->join('diagnosa_m', 'pasienmorbiditas_t.diagnosa_id',  '=', 'diagnosa_m.diagnosa_id')
        ->join('kelompokdiagnosa_m', 'pasienmorbiditas_t.kelompokdiagnosa_id',  '=', 'kelompokdiagnosa_m.kelompokdiagnosa_id')

        ->where('pasienmorbiditas_t.pendaftaran_id','=', $pendaftaran_id)
        ->orderBy('kelompokdiagnosa_m.kelompokdiagnosa_id','asc');

        return $query->get();
    }

    
}
