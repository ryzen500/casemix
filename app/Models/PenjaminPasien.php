<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenjaminPasien extends Model
{
    use HasFactory;

    protected $table = 'penjaminpasien_m';

    public static function getLookupType()
    {

        $data = DB::table('penjaminpasien_m')
            ->select('nama_cob_inacbg as name', 'kode_cob_inacbg as code')
            ->where('penjamin_aktif', true)
            ->where('is_cob', true)
            ->orderBy('kode_cob_inacbg', 'asc')
            ->get();

            return $data;
    }
}
