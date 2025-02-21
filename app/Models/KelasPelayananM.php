<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KelasPelayananM extends Model
{
    use HasFactory;

    protected $table = 'kelaspelayanan_m';

    public static function getKelas()
    {
        $query = DB::table('kelaspelayanan_m ')
        ->select(
            DB::raw('kelaspelayanan_nama as name,lookup_value as value')
        )
        ->from('lookup_m')
        ->where('lookup_type')
        ->orderBy('lookup_name','asc');

        return $query->get();
    }
}
