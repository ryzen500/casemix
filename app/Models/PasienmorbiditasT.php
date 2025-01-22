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
            DB::raw('pasienmorbiditas_t.pasienmorbiditas_id,pasienmorbiditas_t.pendaftaran_id,diagnosa_m.diagnosa_id,diagnosa_m.diagnosa_nama,diagnosa_m.diagnosa_kode,kelompokdiagnosa_m.kelompokdiagnosa_nama')
        )
        ->from('pasienmorbiditas_t')
        ->join('diagnosa_m', 'pasienmorbiditas_t.diagnosa_id',  '=', 'diagnosa_m.diagnosa_id')
        ->join('kelompokdiagnosa_m', 'pasienmorbiditas_t.kelompokdiagnosa_id',  '=', 'kelompokdiagnosa_m.kelompokdiagnosa_id')

        ->where('pasienmorbiditas_t.pendaftaran_id','=', $pendaftaran_id)
        ->orderBy('kelompokdiagnosa_m.kelompokdiagnosa_id','asc');

        return $query->get();
    }
}
