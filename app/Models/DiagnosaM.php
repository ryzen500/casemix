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
    public static function getDiagnosaAutocomplete( $value)
    {
        $results = DB::table('diagnosa_m')
        ->select('diagnosa_id', 'diagnosa_kode', 'diagnosa_nama')
        ->where('diagnosa_aktif', true) // Ensuring that the diagnosa is active
        ->where(function($query) use ($value) {
            $query->whereRaw('LOWER(diagnosa_kode) LIKE ?', ['%' . strtolower($value) . '%'])
                ->orWhereRaw('LOWER(diagnosa_nama) LIKE ?', ['%' . strtolower($value) . '%']);
        });
        // $query = self::buildBaseQueryGrouping();
        // $query = DB::table('diagnosa_m')
        //         ->select(
        //             DB::raw('diagnosa_id,diagnosa_kode,diagnosa_nama'),

        //         )
        //         ->from('diagnosa_m')
        //         ->where('diagnosa_aktif',true)
        //         ->where('LOWER(diagnosa_kode)', 'like', "%$value%")
        //                 ->orWhere('LOWER(diagnosa_nama)', 'like', "%$value%");
                // ->where('d.diagnosa_aktif','=', 1);
        // dd($value,$results,$results->toRawSql());
        return $results->get();

    }
}
