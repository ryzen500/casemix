<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaraKeluarM extends Model
{
    use HasFactory;

    protected $table = 'carakeluar_m';


    public static function getDataListKeluar()
    {
        $query = DB::table('carakeluar_m ')
            ->select(
                DB::raw('carakeluar_nama as name,kode_carakeluar_bpjs as value')
            )
            ->from('carakeluar_m')
            ->where('carakeluar_aktif', true)
            ->orderBy('carakeluar_nama', 'asc');

        return $query->get();
    }
}
