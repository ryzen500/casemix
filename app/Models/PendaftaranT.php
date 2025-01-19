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
                DB::raw("CASE
                    WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim'::text
                    WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN 'Final'::text
                    WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN '-'::text
                    ELSE '-'::text
                    END AS status"),
                DB::raw(value: "p.pendaftaran_id,pa.jeniskelamin,carakeluar_m.carakeluar_nama,ap.nopeserta,pa.tanggal_lahir,concat(DATE_PART('year',age(tanggal_lahir)),' Tahun') as umur,s.klsrawat,inacbg_t.inacbg_tgl,pg.nama_pegawai")

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
                DB::raw("CASE
                    WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim'::text
                    WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN 'Final'::text
                    WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN '-'::text
                    ELSE '-'::text
                    END AS status"),
                DB::raw(value: "p.pendaftaran_id,pa.jeniskelamin,carakeluar_m.carakeluar_nama,ap.nopeserta,pa.tanggal_lahir,concat(DATE_PART('year',age(tanggal_lahir)),' Tahun') as umur,s.klsrawat,inacbg_t.inacbg_tgl,pg.nama_pegawai")
                );
        }

        return $query;
    }
    private static function buildBaseQueryGrouping()
    {
        $laporan = DB::table(function ($query) {
            $query->select(
                'pendaftaran_t.pendaftaran_id',
                'sep_t.sep_id',
                DB::raw("CASE 
                    WHEN pembayaranpelayanan_t.jasaembalase IS NOT NULL THEN pembayaranpelayanan_t.jasaembalase
                    ELSE 0::double precision 
                END AS embalase"),
                DB::raw("CASE 
                    WHEN (obatalkes_m.jenisobatalkes_id = ANY (ARRAY[4, 57])) AND obatalkespasien_t.is_obatkronis IS FALSE THEN obatalkespasien_t.hargajual_oa 
                    WHEN (obatalkes_m.jenisobatalkes_id = ANY (ARRAY[4, 57])) AND obatalkespasien_t.is_obatkronis IS TRUE THEN formulaobatkronis_m.jumlahobat_minimal::double precision * (obatalkespasien_t.hargasatuan_oa + obatalkespasien_t.ppnperobat) 
                    ELSE 0::double precision 
                END AS bmhp"),
                DB::raw("CASE 
                    WHEN obatalkes_m.jenisobatalkes_id = 22 AND obatalkespasien_t.is_obatkronis IS FALSE THEN obatalkespasien_t.hargajual_oa 
                    WHEN obatalkes_m.jenisobatalkes_id = 22 AND obatalkespasien_t.is_obatkronis IS TRUE THEN formulaobatkronis_m.jumlahobat_minimal::double precision * (obatalkespasien_t.hargasatuan_oa + obatalkespasien_t.ppnperobat) 
                    ELSE 0::double precision 
                END AS obat"),
                DB::raw("0 AS biayaadmin"),
                DB::raw("CASE 
                    WHEN obatalkes_m.jenisobatalkes_id = 1 AND obatalkespasien_t.is_obatkronis IS FALSE THEN obatalkespasien_t.hargajual_oa 
                    WHEN obatalkes_m.jenisobatalkes_id = 1 AND obatalkespasien_t.is_obatkronis IS TRUE THEN formulaobatkronis_m.jumlahobat_minimal::double precision * (obatalkespasien_t.hargasatuan_oa + obatalkespasien_t.ppnperobat) 
                    ELSE 0::double precision 
                END AS alkes"),
                DB::raw("CASE 
                    WHEN obatalkes_m.jenisobatalkes_id = 35 THEN obatalkespasien_t.hargajual_oa 
                    ELSE 0::double precision 
                END AS obat_kemoterapi"),
                DB::raw("CASE 
                    WHEN obatalkes_m.jenisobatalkes_id = 36 THEN obatalkespasien_t.hargajual_oa 
                    ELSE 0::double precision 
                END AS obat_kronis")
            )
            ->from('pendaftaran_t')
            ->join('obatalkespasien_t', 'obatalkespasien_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->join('pasien_m', 'pendaftaran_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->join('obatalkes_m', 'obatalkespasien_t.obatalkes_id', '=', 'obatalkes_m.obatalkes_id')
            ->join('sep_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
            ->leftJoin('pembayaranpelayanan_t', 'pembayaranpelayanan_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('tandabuktibayar_t', 'pembayaranpelayanan_t.tandabuktibayar_id', '=', 'tandabuktibayar_t.tandabuktibayar_id')
            ->leftJoin('formulaobatkronis_m', 'formulaobatkronis_m.formulaobatkronis_id', '=', 'obatalkespasien_t.formulaobatkronis_id');
        }, 'laporan')
            ->select(
                'laporan.pendaftaran_id',
                'laporan.sep_id',
                DB::raw('SUM(laporan.obat + laporan.embalase) AS obat'),
                DB::raw('SUM(laporan.alkes) AS alkes'),
                DB::raw('SUM(laporan.bmhp) AS bmhp'),
                DB::raw('SUM(laporan.obat_kemoterapi) AS obatkemoterapi'),
                DB::raw('SUM(laporan.obat_kronis) AS obatkronis'),
                DB::raw('SUM(laporan.obat + laporan.alkes + laporan.bmhp + laporan.obat_kemoterapi + laporan.obat_kronis) AS total')
            )
            ->groupBy('laporan.pendaftaran_id', 'laporan.sep_id');
        return $laporan;
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
    public static function getGroupping(int $pendaftaran_id)
    {
        $query = self::buildBaseQueryGrouping();
        $query->where('laporan.pendaftaran_id', '=', $pendaftaran_id);
        return $query->first();
    }
    public static function getDataGroup(int $pendaftaran_id)
    {
        $query = DB::table('pendaftaran_t as p')
        ->select(
            DB::raw('p.pendaftaran_id, s.*'),
            DB::raw("CASE
                WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim'::text
                WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN 'Final'::text
                WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN '-'::text
                ELSE '-'::text
                END AS status"),
            DB::raw('pg.nama_pegawai, inasiscbg_t.kodeprosedur AS cbg'),
            DB::raw('p.umur'),

        )
        ->join('sep_t as s', 's.sep_id', '=', 'p.sep_id')
        // ->join('pasien_m as pm', 'pm.pasien_id', '=', 'p.pasien_id')
        ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 'p.sep_id')
        ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
        ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
        ->where('p.pendaftaran_id', $pendaftaran_id);
        // $query->where('laporan.pendaftaran_id', '=', $pendaftaran_id);
        return $query->first();
    } 
    public static function getTarif($pendaftaran_id)
    {
        $laporan = DB::table(function ($query) {
            $query->select(
                'sep_t.sep_id',
                'sep_t.nosep',
                'sep_t.nokartuasuransi',
                'sep_t.namaasuransi_cob',
                'sep_t.klsrawat',
                'pendaftaran_t.pendaftaran_id',
                'pendaftaran_t.no_pendaftaran',
                'pendaftaran_t.pasien_id',
                'pasien_m.no_rekam_medik',
                'pasien_m.nama_pasien',
                'sep_t.dpjpygmelayani_nama AS nama_dpjp',
                'inacbg_t.no_reg_sitb',
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 1 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS prosedurenonbedah"),
                DB::raw("CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 2 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS tenagaahli"),
                DB::raw("CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 3 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS radiologi"),
                DB::raw("CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 4 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS rehabilitasi"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 5 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS sewaalat"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 6 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS prosedurebedah"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 7 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS keperawatan"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 8 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS laboratorium"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 9 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS kamar_akomodasi"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 10 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS konsultasi"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 11 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS penunjang_ekg_echo"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 12 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS pelayanandarah"),
                DB::raw(" CASE WHEN daftartindakan_m.kelompoktindakanbpjs_id = 13 THEN tindakanpelayanan_t.tarif_tindakan ELSE 0 :: double precision END AS rawatintensif"),
                DB::raw("0 AS bmhp"),
                DB::raw(" pembayaranpelayanan_t.jasaembalase AS obat"),
                DB::raw("tandabuktibayar_t.biayaadministrasi AS biayaadmin"),
                DB::raw("0 AS alkes"),
                DB::raw("0 AS obat_kemoterapi"),
                DB::raw("0 AS obat_kronis")


            )
            ->from('pendaftaran_t')
            ->join('tindakanpelayanan_t', 'tindakanpelayanan_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->join('pasien_m', 'pendaftaran_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->join('daftartindakan_m', 'tindakanpelayanan_t.daftartindakan_id', '=', 'daftartindakan_m.daftartindakan_id')
            ->leftJoin('kelompoktindakanbpjs_m', 'kelompoktindakanbpjs_m.kelompoktindakanbpjs_id', '=', 'daftartindakan_m.kelompoktindakanbpjs_id')
            ->join('sep_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
            ->leftJoin('pasienadmisi_t', 'pasienadmisi_t.pasienadmisi_id', '=', 'pendaftaran_t.pasienadmisi_id')
            ->join('carabayar_m', 'pendaftaran_t.carabayar_id', '=', 'carabayar_m.carabayar_id')
            ->leftJoin('pasienpulang_t', 'pendaftaran_t.pasienpulang_id', '=', 'pasienpulang_t.pasienpulang_id')
            ->leftJoin('carakeluar_m', 'pasienpulang_t.carakeluar_id', '=', 'carakeluar_m.carakeluar_id')
            ->leftJoin('pembayaranpelayanan_t', 'pendaftaran_t.pendaftaran_id', '=', 'pembayaranpelayanan_t.pendaftaran_id')
            ->leftJoin('tandabuktibayar_t', 'pembayaranpelayanan_t.tandabuktibayar_id', '=', 'tandabuktibayar_t.tandabuktibayar_id')
            ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 'sep_t.sep_id')
            ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id');

        }, 'laporan')
            ->select(
                'laporan.sep_id',
                'laporan.nosep',
                'laporan.nokartuasuransi',
                'laporan.klsrawat',
                'laporan.namaasuransi_cob',
                'laporan.pendaftaran_id',
                'laporan.no_pendaftaran',
                'laporan.pasien_id',
                'laporan.no_rekam_medik',
                'laporan.nama_pasien',

                DB::raw(' sum(laporan.prosedurenonbedah) AS prosedurenonbedah'),
                DB::raw(' sum(laporan.prosedurebedah) AS prosedurebedah'),
                DB::raw('sum(laporan.konsultasi) AS konsultasi'),
                DB::raw('sum(laporan.tenagaahli) AS tenagaahli'),
                DB::raw('  sum(laporan.keperawatan) AS keperawatan, 
  sum(laporan.penunjang_ekg_echo) AS penunjang, 
  sum(laporan.radiologi) AS radiologi, 
  sum(laporan.laboratorium) AS laboratorium, 
  sum(laporan.pelayanandarah) AS pelayanandarah, 
  sum(laporan.rehabilitasi) AS rehabilitasi, 
  sum(
    laporan.kamar_akomodasi + laporan.biayaadmin
  ) AS kamar_akomodasi, 
  sum(laporan.rawatintensif) AS rawatintensif, 
  sum(
    laporan.prosedurenonbedah + laporan.prosedurebedah + laporan.konsultasi + laporan.tenagaahli + laporan.keperawatan + laporan.penunjang_ekg_echo + laporan.radiologi + laporan.laboratorium + laporan.pelayanandarah + laporan.rehabilitasi + laporan.kamar_akomodasi + laporan.rawatintensif
  ) AS total '),
            )
            ->where('laporan.pendaftaran_id', $pendaftaran_id)
            ->groupBy('laporan.pendaftaran_id','laporan.sep_id', 'laporan.nosep','laporan.nokartuasuransi','laporan.namaasuransi_cob','laporan.no_pendaftaran','laporan.pasien_id','laporan.no_rekam_medik','laporan.klsrawat','laporan.nama_pasien');
        return $laporan->first();
    }
}
