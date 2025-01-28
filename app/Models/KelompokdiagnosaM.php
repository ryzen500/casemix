<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class KelompokdiagnosaM extends Model
{
    use HasFactory;

    public static function getKelompokDiagnosa()
    {
        $query = DB::table('kelompokdiagnosa_m ')
        ->select(
            DB::raw('kelompokdiagnosa_nama as name,kelompokdiagnosa_id as value')
        )
        ->from('kelompokdiagnosa_m')
        ->where('kelompokdiagnosa_m.kelompokdiagnosa_aktif', true) // Ensuring that the diagnosa is active

        ->orderBy('kelompokdiagnosa_nama','asc');

        return $query->get();
    }
}
