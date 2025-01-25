<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasienMordibitasR extends Model
{
    use HasFactory;

    protected $table = 'pasienmorbiditas_r';

    protected $fillable = [
        'pegawai_id',
        'diagnosa_id',
        'kelompokdiagnosa_id',
        'pendaftaran_id',
        'pasien_id',
        'tglmordibitas',
        'kasusdiagnosa',
        'create_loginpemakai_id'
    ];

    public static function getMorbiditas($pendaftaran_id)
    {
        $query = DB::table('pasienmorbiditas_r ')
        ->select(
            DB::raw('pasienmorbiditas_r.jeniskasuspenyakit_id,pasienmorbiditas_r.ruangan_id,pasienmorbiditas_r.pegawai_id,pasienmorbiditas_r.kelompokumur_id,pasienmorbiditas_r.pasien_id,pasienmorbiditas_r.golonganumur_id,pasienmorbiditas_r.tglmorbiditas,pasienmorbiditas_r.kasusdiagnosa,pasienmorbiditas_r.create_time,pasienmorbiditas_r.create_loginpemakai_id,pasienmorbiditas_r.create_ruangan,pasienmorbiditas_r.pendaftaran_id,diagnosa_m.diagnosa_id,kelompokdiagnosa_m.kelompokdiagnosa_id')
        )
        ->from('pasienmorbiditas_r')
        ->Join('diagnosa_m', 'pasienmorbiditas_r.diagnosa_id',  '=', 'diagnosa_m.diagnosa_id')
        ->Join('kelompokdiagnosa_m', 'pasienmorbiditas_r.kelompokdiagnosa_id',  '=', 'kelompokdiagnosa_m.kelompokdiagnosa_id')

        ->where('pasienmorbiditas_r.pendaftaran_id','=', $pendaftaran_id)
        ->orderBy('kelompokdiagnosa_m.kelompokdiagnosa_id','asc');

        return $query->get();
    }

}
