<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AsuransipasienM extends Model
{
    use HasFactory;

    public static function getByNoka(string $noKartu)
    {
        $results = DB::table('asuransipasien_m')
             ->where('nokartuasuransi', $noKartu)
             ->orderBy('asuransipasien_id', 'desc')
             ->first();
        return ($results);

    }
}
