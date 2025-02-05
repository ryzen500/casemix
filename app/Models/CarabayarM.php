<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CarabayarM extends Model
{
    use HasFactory;

    public static function getCarabayar()
    {
        $query = DB::table('carabayar_m')
        ->select(
            DB::raw('carabayar_nama as name,carabayar_id as value')
        )
        ->from('carabayar_m')
        ->where('carabayar_m.carabayar_aktif', true) // Ensuring that the diagnosa is active
        ->whereNotNull('kode_carabayar_inacbg') // Ensure that 'kode_carabayar_inacbg' is not null
        ->where('kode_carabayar_inacbg', '<>', '') // Ensure that 'kode_carabayar_inacbg' is not an empty string

        ->orderBy('carabayar_nama','asc');

        return $query->get();
    }
    
    public static function getCarabayarById( $carabayar_id)
    {
        // $query = self::buildBaseQueryGrouping();
        $query = DB::table('carabayar_m')
                ->select('carabayar_id', 'carabayar_nama')
                ->where('carabayar_aktif', true) // Ensuring that the diagnosa is active
                ->where('carabayar_id', $carabayar_id);
                // ->where('s.nosep', '=', "'".$nosep."'");
        return $query->first();

    }
}
