<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ProfilrumahsakitM extends Model
{
    use HasFactory;
    public static function getProfilRS()
    {
        $query = DB::table('profilrumahsakit_m ')
        ->select(
            DB::raw('profilrumahsakit_m.*')
        )
        ->from('profilrumahsakit_m');

        return $query->first();
    }
}
