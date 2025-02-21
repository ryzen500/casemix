<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstalasiM extends Model
{
    use HasFactory;

    protected $table = 'instalasi_m';

    public static function getInstalasi()
    {
        // $query = self::buildBaseQueryGrouping();
        $query = DB::table('instalasi_m')
            ->select('instalasi_id', 'instalasi_nama')
            ->where('instalasi_aktif', true); // Ensuring that the diagnosa is active
        // ->where('s.nosep', '=', "'".$nosep."'");
        return $query->get();

    }
}
