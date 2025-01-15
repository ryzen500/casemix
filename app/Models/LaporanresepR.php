<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class LaporanresepR extends Model
{
    use HasFactory;
    protected $table = 'laporansep_r';

    /**
     * Hitung total item untuk pagination.
     */

    public static function getTotalItems(array $filters): int
    {

        $query = DB::table('sep_t');

        // Terapkan filter dinamis
        if(count($filters)>0){
            foreach ($filters as $key => $value) {
                if (!empty($value)) {
                    if ($key === 'tgl_sep') {
                        $query->whereBetween('sep_t.tgl_sep', $value);
                        // $query->where('sep_t.tgl_sep', 'like', "%$value%");
                    }
                     else {
                        $query->where($key, $value);
                    }
                }
            }

        }

        return $query->count();
    }
    /**
     * Ambil data untuk ditampilkan dengan pagination.
     */
    public static function getPaginatedData(int $limit, int $offset, array $filters)
    {
        
        $query = DB::table('sep_t');

        // Terapkan filter dinamis
        if(count($filters)>0){
            foreach ($filters as $key => $value) {
                if (!empty($value)) {
                    if ($key === 'tgl_sep') {
                        $query->whereBetween('sep_t.tgl_sep', $value);
                        // $query->where('sep_t.tgl_sep', 'like', "%$value%");
                    }
                     else {
                        $query->where($key, $value);
                    }
                }
            }

        }

        return $query->offset($offset)->limit($limit)->get();



    }

}
