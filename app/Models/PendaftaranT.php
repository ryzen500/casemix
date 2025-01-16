<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PendaftaranT extends Model
{
    use HasFactory;
    private static function buildBaseQuery(bool $isSecondQuery = false)
    {
        
        if($isSecondQuery==true){
            $query = DB::table('pendaftaran_t as p')
            ->join('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
            ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')
            ->leftJoin('pasienadmisi_t as pas', 'pas.pasienadmisi_id', '=', 'p.pasienadmisi_id')
            ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 's.sep_id')
            ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
            ->leftJoin('pasienpulang_t', 'p.pasienpulang_id', '=', 'pasienpulang_t.pasienpulang_id')
            ->leftJoin('carakeluar_m', 'pasienpulang_t.carakeluar_id', '=', 'carakeluar_m.carakeluar_id')
            ->leftJoin('ruangan_m', 'ruangan_m.ruangan_id', '=', 'p.ruangan_id')
            ->leftJoin('instalasi_m', 'instalasi_m.instalasi_id', '=', 'ruangan_m.instalasi_id')
            ->leftJoin('asuransipasien_m as ap', 'ap.asuransipasien_id', '=', 'p.asuransipasien_id')

            ->select(
                DB::raw('instalasi_m.instalasi_nama, ruangan_m.ruangan_nama'),
                DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.tgladmisi ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglmasuk'),
                DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.rencanapulang ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglpulang'),
                DB::raw('pa.nama_pasien, pa.no_rekam_medik,pa.pasien_id,s.nosep,s.hakkelas_kode,s.dpjpygmelayani_nama AS nama_dpjp'),
                DB::raw("'JKN'::text AS jaminan"),
                DB::raw("CASE WHEN s.jnspelayanan = 2 THEN 'RJ' WHEN s.jnspelayanan = 1 THEN 'RI' ELSE '?' END AS tipe"),
                'inasiscbg_t.kodeprosedur as cbg',
                DB::raw("CASE
                    WHEN inacbg_t.tglrawat_masuk IS NOT NULL THEN date(inacbg_t.tglrawat_masuk)
                    WHEN inacbg_t.tglrawat_masuk IS NULL AND p.pasienadmisi_id IS NULL THEN date(p.tgl_pendaftaran)
                    WHEN inacbg_t.tglrawat_masuk IS NULL AND p.pasienadmisi_id IS NOT NULL THEN date(pas.tgladmisi)
                    ELSE date(p.tgl_pendaftaran)
                END AS tanggalmasuk_inacbg"),
                DB::raw("CASE
                    WHEN inacbg_t.tglrawat_keluar IS NOT NULL THEN date(inacbg_t.tglrawat_keluar)
                    WHEN inacbg_t.tglrawat_keluar IS NULL AND p.pasienpulang_id IS NOT NULL THEN date(pasienpulang_t.tglpasienpulang)
                    WHEN inacbg_t.tglrawat_keluar IS NULL THEN date(p.tgl_pendaftaran)
                    ELSE date(p.tgl_pendaftaran)
                END AS tanggalpulang_inacbg"),
                DB::raw("CASE
                    WHEN p.pasienpulang_id IS NOT NULL THEN pasienpulang_t.hariperawatan
                    ELSE 1
                END AS los"),
                DB::raw('0 AS beratbadan_gram'),
                DB::raw(value: "p.pendaftaran_id,carakeluar_m.carakeluar_nama,ap.nopeserta,pa.tanggal_lahir,concat(DATE_PART('year',age(tanggal_lahir)),' Tahun') as umur,s.klsrawat,inacbg_t.inacbg_tgl,pg.nama_pegawai")

                ); 

        }else{
            $query = DB::table('pendaftaran_t as p')
            ->join('pasien_m as pa', 'pa.pasien_id', '=', 'p.pasien_id')
            ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')
            ->leftJoin('pasienadmisi_t as pas', 'pas.pasienadmisi_id', '=', 'p.pasienadmisi_id')
            ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 's.sep_id')
            ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
            ->leftJoin('pasienpulang_t', 'p.pasienpulang_id', '=', 'pasienpulang_t.pasienpulang_id')
            ->leftJoin('carakeluar_m', 'pasienpulang_t.carakeluar_id', '=', 'carakeluar_m.carakeluar_id')
            ->leftJoin('ruangan_m', 'ruangan_m.ruangan_id', '=', 'p.ruangan_id')
            ->leftJoin('instalasi_m', 'instalasi_m.instalasi_id', '=', 'ruangan_m.instalasi_id')
            ->leftJoin('asuransipasien_m as ap', 'ap.asuransipasien_id', '=', 'p.asuransipasien_id')
            ->whereNotNull('p.pasienbatalperiksa_id')
            ->where('pa.pasien_id', '=', 317787)
            ->select(
                DB::raw('instalasi_m.instalasi_nama, ruangan_m.ruangan_nama'),
                DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.tgladmisi ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglmasuk'),
                DB::raw('CASE WHEN p.pasienadmisi_id IS NOT NULL THEN pas.rencanapulang ELSE date(p.tgl_pendaftaran)::timestamp without time zone END AS tglpulang'),
                DB::raw('pa.nama_pasien, pa.no_rekam_medik,pa.pasien_id,s.nosep,s.hakkelas_kode,s.dpjpygmelayani_nama AS nama_dpjp'),
                DB::raw("'JKN'::text AS jaminan"),
                DB::raw("CASE WHEN s.jnspelayanan = 2 THEN 'RJ' WHEN s.jnspelayanan = 1 THEN 'RI' ELSE '?' END AS tipe"),
                'inasiscbg_t.kodeprosedur as cbg',
                DB::raw("CASE
                    WHEN inacbg_t.tglrawat_masuk IS NOT NULL THEN date(inacbg_t.tglrawat_masuk)
                    WHEN inacbg_t.tglrawat_masuk IS NULL AND p.pasienadmisi_id IS NULL THEN date(p.tgl_pendaftaran)
                    WHEN inacbg_t.tglrawat_masuk IS NULL AND p.pasienadmisi_id IS NOT NULL THEN date(pas.tgladmisi)
                    ELSE date(p.tgl_pendaftaran)
                END AS tanggalmasuk_inacbg"),
                DB::raw("CASE
                    WHEN inacbg_t.tglrawat_keluar IS NOT NULL THEN date(inacbg_t.tglrawat_keluar)
                    WHEN inacbg_t.tglrawat_keluar IS NULL AND p.pasienpulang_id IS NOT NULL THEN date(pasienpulang_t.tglpasienpulang)
                    WHEN inacbg_t.tglrawat_keluar IS NULL THEN date(p.tgl_pendaftaran)
                    ELSE date(p.tgl_pendaftaran)
                END AS tanggalpulang_inacbg"),
                DB::raw("CASE
                    WHEN p.pasienpulang_id IS NOT NULL THEN pasienpulang_t.hariperawatan
                    ELSE 1
                END AS los"),
                DB::raw('0 AS beratbadan_gram'),
                DB::raw(value: "p.pendaftaran_id,carakeluar_m.carakeluar_nama,ap.nopeserta,pa.tanggal_lahir,concat(DATE_PART('year',age(tanggal_lahir)),' Tahun') as umur,s.klsrawat,inacbg_t.inacbg_tgl,pg.nama_pegawai")
                );
        }

        return $query;
    }
    public static function dataListGrouper(int $pasien_id)
    {
        $query = self::buildBaseQuery();
        $query->whereNotNull('p.pasienbatalperiksa_id');
        $query->where('pa.pasien_id', '=', $pasien_id);
        $query2 = self::buildBaseQuery(isSecondQuery: true);
        $query2->whereNotNull('p.pasienbatalperiksa_id');
        $query2->where('pa.pasien_id', '=', $pasien_id);
        return $query->union($query2)->get();

    }
}
