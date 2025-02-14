<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class LookupM extends Model
{
    use HasFactory;
    public static function getLookupType($type)
    {
        $query = DB::table('lookup_m ')
        ->select(
            DB::raw('lookup_name as name,lookup_value as value ,lookup_kode as kode ')
        )
        ->from('lookup_m')
        ->where('lookup_type', $type)
        ->orderBy('lookup_name','asc');

        return $query->get();
    }


    public static function getLookupTypeSequence($type)
    {
        $query = DB::table('lookup_m ')
        ->select(
            DB::raw('lookup_urutan,lookup_name as name,lookup_value as value ,lookup_kode as kode ')
        )
        ->from('lookup_m')
        ->where('lookup_type', $type)
        ->orderBy('lookup_urutan','ASC');

        return $query->get();
    }
}
