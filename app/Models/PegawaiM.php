<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PegawaiM extends Model
{
    use HasFactory;
    protected $table = 'pegawai_m';

    protected $primaryKey = 'pegawai_id'; // Adjust if the table uses a different primary key
    // Relasi dengan LoginPemakaiK
    public function loginPemakai()
    {
        return $this->hasMany(LoginPemakaiK::class);
    }

    public static function getPegawaiDPJP($kelompokpegawai_id)
    {
        $query = DB::table('pegawai_m')
        ->select(
            DB::raw("CONCAT(
                COALESCE(pegawai_m.gelardepan, ''), ' ',
                pegawai_m.nama_pegawai, ' ',
                COALESCE(gelarbelakang_m.gelarbelakang_nama, '')
            ) AS nmDPJP"),
             DB::raw('pegawai_m.pegawai_id'),
            'pegawai_m.kodedokter_bpjs AS kdDPJP'
        )
        ->leftJoin('gelarbelakang_m', 'pegawai_m.gelarbelakang_id', '=', 'gelarbelakang_m.gelarbelakang_id') // Adjust the join condition as per your database schema
        ->where('pegawai_m.kelompokpegawai_id', $kelompokpegawai_id)
        ->where('pegawai_m.pegawai_aktif', true) // Ensuring that the diagnosa is active
        ->orderBy('pegawai_m.nama_pegawai', 'asc');
    

        return $query->get();
    }

}
