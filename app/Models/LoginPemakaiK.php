<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class LoginPemakaiK extends Authenticatable
{
    use Notifiable;

    protected $table = 'loginpemakai_k';
    protected $primaryKey = 'loginpemakai_id'; // Adjust if the table uses a different primary key
    public $timestamps = false; // Set to true if timestamps exist


     // Relasi dengan Pegawai
     public function pegawai()
     {
         return $this->belongsTo(PegawaiM::class, 'pegawai_id');
     }
    protected $fillable = ['nama_pemakai', 'katakunci_pemakai']; // Define the columns you allow for mass assignment
    // Define username and password fields for authentication
    public function getAuthIdentifierName()
    {
        return 'nama_pemakai';
    }

    public function getAuthPassword()
    {
        return $this->katakunci_pemakai;
    }
    public static function getCoder($coder_nik)
    {
        $query = DB::table('loginpemakai_k')
        ->select(
            DB::raw("CONCAT(
                COALESCE(pegawai_m.gelardepan, ''), ' ',
                pegawai_m.nama_pegawai, ' ',
                COALESCE(gelarbelakang_m.gelarbelakang_nama, '')
            ) AS namaLengkap"),
 
        )
        ->join('pegawai_m', 'pegawai_m.pegawai_id','=','loginpemakai_k.pegawai_id')
        ->leftJoin('gelarbelakang_m', 'pegawai_m.gelarbelakang_id', '=', 'gelarbelakang_m.gelarbelakang_id') // Adjust the join condition as per your database schema
        ->where('loginpemakai_k.coder_nik', $coder_nik);    

        return $query->first();
    }
}
