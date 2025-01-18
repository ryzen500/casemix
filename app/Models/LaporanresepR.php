<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Log;

class LaporanresepR extends Model
{
    use HasFactory;
    protected $table = 'sep_t';
    /**
     * Helper function to build the base query for `sep_t`.
     */
    private static function buildBaseQuery()
    {
        // Mengurangi LEFT JOIN dan mengganti dengan JOIN jika data selalu ada.
        return DB::table('sep_t')
            ->leftJoin('pendaftaran_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
            ->join('inacbg_t', 'sep_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->leftJoin('pasien_m as pa', 'pendaftaran_t.pasien_id', '=', 'pa.pasien_id')
            ->leftJoin('tindakanpelayanan_t', 'tindakanpelayanan_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('obatalkespasien_t', 'obatalkespasien_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('formulaobatkronis_m', 'formulaobatkronis_m.formulaobatkronis_id', '=', 'obatalkespasien_t.formulaobatkronis_id')
            ->selectRaw('
            pa.no_rekam_medik,
            pa.nama_pasien,
            inacbg_t.inacbg_id,
            inacbg_t.tarifgruper,
            inacbg_t.kodeinacbg,
            inacbg_t.total_tarif_rs,
            sep_t.sep_id,
            sep_t.tglsep,
            sep_t.tglpulang,
            sep_t.nosep,
            sep_t.nokartuasuransi,

            SUM(CASE 
                WHEN tindakanpelayanan_t.pendaftaran_id IS NOT NULL THEN tindakanpelayanan_t.tarif_tindakan 
                ELSE 0 
            END) AS tindakan,
            SUM(CASE 
                WHEN obatalkespasien_t.pendaftaran_id IS NOT NULL THEN 
                    CASE 
                        WHEN obatalkespasien_t.is_obatkronis IS FALSE THEN obatalkespasien_t.hargajual_oa
                        WHEN obatalkespasien_t.is_obatkronis IS TRUE THEN 
                            formulaobatkronis_m.jumlahobat_minimal::double precision * 
                            (obatalkespasien_t.hargasatuan_oa + obatalkespasien_t.ppnperobat)
                        ELSE 0::double precision
                    END 
                ELSE 0 
            END) AS obat,
            SUM(
                CASE 
                    WHEN tindakanpelayanan_t.pendaftaran_id IS NOT NULL THEN tindakanpelayanan_t.tarif_tindakan 
                    ELSE 0 
                END + 
                CASE 
                    WHEN obatalkespasien_t.pendaftaran_id IS NOT NULL THEN 
                        CASE 
                            WHEN obatalkespasien_t.is_obatkronis IS FALSE THEN obatalkespasien_t.hargajual_oa
                            WHEN obatalkespasien_t.is_obatkronis IS TRUE THEN 
                                formulaobatkronis_m.jumlahobat_minimal::double precision * 
                                (obatalkespasien_t.hargasatuan_oa + obatalkespasien_t.ppnperobat)
                            ELSE 0::double precision
                        END 
                    ELSE 0 
                END) AS total_tarif_inacbg
        ')
            ->groupBy('pa.no_rekam_medik', 'pa.nama_pasien', 'inacbg_t.inacbg_id', 'sep_t.sep_id');
    }

    /**
     * Apply filters to the query.
     */
    private static function applyFilters($query, array $filters)
    {
        // Perbaiki kondisi tanggal untuk menyesuaikan format yang benar.
        if (!empty($filters['tanggal_mulai']) && !empty($filters['tanggal_selesai'])) {
            $query->whereBetween(DB::raw('DATE(sep_t.tglsep)'), [$filters['tanggal_mulai'], $filters['tanggal_selesai']]);
        } elseif (!empty($filters['tanggal_mulai'])) {
            $query->whereDate('sep_t.tglsep', $filters['tanggal_mulai']);
        }

        return $query;
    }

    /**
     * Get the total count of items for pagination.
     */
    public static function getTotalItems(array $filters): int
    {
        // Gunakan query builder tanpa data yang tidak diperlukan.
        $query = self::buildBaseQuery();
        $query = self::applyFilters($query, $filters);
    
        // dd($query->count());
        // Menggunakan DISTINCT untuk menghitung data yang unik
        // return $query->count();
        return sizeof($query->get()->toArray());
    }
    

    /**
     * Get paginated data for display.
     */
    public static function getPaginatedData(int $limit, int $offset, array $filters)
    {
        $query = self::buildBaseQuery();
        $query = self::applyFilters($query, $filters);
    

        // Log::info($query->toRawSql());
        // Menggunakan DISTINCT pada hasil paginasi
        return $query->offset($offset)->limit($limit)->get();
    }
    


}
