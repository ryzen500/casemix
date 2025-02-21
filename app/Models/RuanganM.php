<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RuanganM extends Model
{
    use HasFactory;

    protected $table  ='ruangan_m';


    public static function getRuangan()
    {
        // $query = self::buildBaseQueryGrouping();
        $query = DB::table('ruangan_m')
            ->select('ruangan_id', 'ruangan_nama')
            ->where('ruangan_aktif', true); // Ensuring that the diagnosa is active
        // ->where('s.nosep', '=', "'".$nosep."'");
        return $query->get();

    }
}
