<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PembayaranPelayananT extends Model
{
    use HasFactory;

    protected $table = 'pembayaranpelayanan_t';

    public static function getTarifSIMRS(int $pembayaranpelayanan_id)
    {
        $query = self::buildBaseQueryTandaBuktiBayar();
        $query->where('pembayaranpelayanan_t.pembayaranpelayanan_id', '=', $pembayaranpelayanan_id);
        return $query->first();
    }

    private static function buildBaseQueryTandaBuktiBayar()
    {
        $laporan = DB::table('tandabuktibayar_t')
            ->selectRaw(
                'tandabuktibayar_t.jmlpembayaran - pembayaranpelayanan_t.selisihuntungrugibpjs + tandabuktibayar_t.jmlpembulatanasuransi AS total_tarif, tandabuktibayar_t.jmlpembulatanasuransi'
            )
            ->join('pembayaranpelayanan_t', 'tandabuktibayar_t.pembayaranpelayanan_id', '=', 'pembayaranpelayanan_t.pembayaranpelayanan_id')
            ->join('pendaftaran_t', 'pembayaranpelayanan_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->join('pasien_m', 'pendaftaran_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->join('obatalkespasien_t', 'pembayaranpelayanan_t.pendaftaran_id', '=', 'obatalkespasien_t.pendaftaran_id')
            ->join('obatalkes_m', 'obatalkespasien_t.obatalkes_id', '=', 'obatalkes_m.obatalkes_id')
            ->join('sep_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
            ->leftJoin('formulaobatkronis_m', 'formulaobatkronis_m.formulaobatkronis_id', '=', 'obatalkespasien_t.formulaobatkronis_id');

        return $laporan;
    }
}
