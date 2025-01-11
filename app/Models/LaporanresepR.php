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

    public static function getTotalItems(): int
    {
        return DB::table('laporansep_r')
            ->count();
    }
    /**
     * Ambil data untuk ditampilkan dengan pagination.
     */
    public static function getPaginatedData(int $limit, int $offset)
    {
        return DB::table('laporansep_r')
            ->offset($offset)
            ->limit($limit)
            ->get();
    }

}
