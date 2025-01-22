<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PegawaiM extends Model
{
    use HasFactory;
    protected $table = 'pegawai_m';

    public static function getPegawaiDPJP($kelompokpegawai_id)
    {
        $query = DB::table('pegawai_m')
        ->select(
            DB::raw("CONCAT(
                COALESCE(pegawai_m.gelardepan, ''), ' ',
                pegawai_m.nama_pegawai, ' ',
                COALESCE(gelarbelakang_m.gelarbelakang_nama, '')
            ) AS nmDPJP"),
            'pegawai_m.kodedokter_bpjs AS kdDPJP'
        )
        ->leftJoin('gelarbelakang_m', 'pegawai_m.gelarbelakang_id', '=', 'gelarbelakang_m.gelarbelakang_id') // Adjust the join condition as per your database schema
        ->where('pegawai_m.kelompokpegawai_id', $kelompokpegawai_id)
        ->orderBy('pegawai_m.nama_pegawai', 'asc');
    

        return $query->get();
    }

}
