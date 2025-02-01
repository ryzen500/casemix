<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Pasienicd9cmT extends Model
{
    use HasFactory;

    public static function getIcdIX($pendaftaran_id)
    {
        $query = DB::table('pasienicd9cm_t ')
        ->select(
            DB::raw('diagnosaicdix_m.diagnosaicdix_nama,diagnosaicdix_m.diagnosaicdix_id,diagnosaicdix_m.diagnosaicdix_kode,pasienicd9cm_t.pasienicd9cm_id,pasienicd9cm_t.pendaftaran_id,kelompokdiagnosa_m.kelompokdiagnosa_id,kelompokdiagnosa_m.kelompokdiagnosa_nama')
        )
        ->from('pasienicd9cm_t')
        ->join('diagnosaicdix_m', 'pasienicd9cm_t.diagnosaicdix_id',  '=', 'diagnosaicdix_m.diagnosaicdix_id')
        ->join('kelompokdiagnosa_m', 'pasienicd9cm_t.kelompokdiagnosa_id',  '=', 'kelompokdiagnosa_m.kelompokdiagnosa_id')

        ->where('pasienicd9cm_t.pendaftaran_id','=', $pendaftaran_id)
        ->orderBy('kelompokdiagnosa_m.kelompokdiagnosa_id','asc');

        return $query->get();
    }
}
