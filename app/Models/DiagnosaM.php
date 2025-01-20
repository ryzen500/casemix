<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DiagnosaM extends Model
{
    use HasFactory;
    public static function getDiagnosaByCode( $diagnosa_kode)
    {
        // $query = self::buildBaseQueryGrouping();
        $query = DB::table('diagnosa_m as d')
                ->select(
                    DB::raw('d.diagnosa_id,d.diagnosa_kode,d.diagnosa_nama'),

                )
                ->where('d.diagnosa_kode', $diagnosa_kode);
                // ->where('s.nosep', '=', "'".$nosep."'");
        return $query->first();

    }
}
