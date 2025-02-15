<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class InformasiSepGrouping extends Model
{
    private static function baseQuery()
    {
        $query = DB::table('sep_t')
        ->select([
            'sep_t.sep_id', 'sep_t.tglsep', 'sep_t.tglpulang', 'sep_t.nosep','pasien_m.nama_pasien',
            'sep_t.nokartuasuransi', 'sep_t.tglrujukan', 'sep_t.norujukan',
            'sep_t.ppkrujukan', 'sep_t.ppkpelayanan',
            DB::raw("CASE WHEN sep_t.jnspelayanan = '2'  THEN 'Rawat Jalan' WHEN sep_t.jnspelayanan = '1' THEN 'Rawat Inap' ELSE '-' END AS jnspelayanan"),

            //  'sep_t.jnspelayanan',
            'sep_t.catatansep', 'sep_t.diagnosaawal', 'sep_t.politujuan',
            'sep_t.klsrawat', 'sep_t.lakalantas', 'sep_t.penjamin_lakalantas',
            'sep_t.lokasi_lakalantas', 'sep_t.no_telpon_peserta', 'sep_t.poli_eksekutif',
            'sep_t.cob', 'sep_t.kode_dpjp', 'pendaftaran_t.no_pendaftaran',
            'pasien_m.no_rekam_medik', 'pasien_m.nama_pasien', 'pendaftaran_t.pendaftaran_id',
            DB::raw('NULL AS pasienadmisi_id'), 'pendaftaran_t.carabayar_id',
            'pendaftaran_t.penjamin_id', 'pendaftaran_t.ruangan_id', 'instalasi_m.instalasi_id',
            'pendaftaran_t.statusperiksa', 'suratperintahranap_t.suratperintahranap_id',
            'sep_t.issinkron', 'pendaftaran_t.pasien_id',
            DB::raw('pendaftaran_t.tgl_pendaftaran AS tgl_masuk'),
            DB::raw('pendaftaran_t.tgl_pendaftaran AS tgl_pulang'),
            'inacbg_t.inacbg_id', 'inacbg_t.inacbg_tgl', 'inacbg_t.total_tarif_rs',
            DB::raw("CASE WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim' WHEN inacbg_t.is_finalisasi = true THEN 'Final' ELSE 'Normal' END AS status"),
            'pegawai_m.nama_pegawai AS inacbg_loginpemakai_id', 'inasiscbg_t.kodeprosedur',
            'inasiscbg_t.plafonprosedur', 'ruangan_m.ruangan_nama', 'inacbg_t.is_finalisasi',
            'inacbg_t.is_terkirim'
        ])
        ->join('pendaftaran_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
        ->join('pasien_m', 'pendaftaran_t.pasien_id', '=', 'pasien_m.pasien_id')
        ->leftJoin('suratperintahranap_t', 'suratperintahranap_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
        ->leftJoin('ruangan_m', 'ruangan_m.ruangan_id', '=', 'pendaftaran_t.ruangan_id')
        ->leftJoin('instalasi_m', 'instalasi_m.instalasi_id', '=', 'ruangan_m.instalasi_id')
        ->leftJoin('inacbg_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
        ->leftJoin('pegawai_m', 'inacbg_t.create_loginpemakai_id', '=', 'pegawai_m.loginpemakai_id')
        ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
        ->whereNull('pendaftaran_t.pasienadmisi_id')
        ->where('inacbg_t.is_finalisasi',true)
        ->where('inacbg_t.is_terkirim',true)

        ->whereNull('pendaftaran_t.pasienbatalperiksa_id');
        return $query;
            
    }

    public static function getSepData()
    {
        return self::baseQuery()->get();
    }

    public static function getPaginatedData($limit, $offset, $filters)
    {
        $query = self::baseQuery();
        // dd($filters);

        if($filters['periode'] === "tanggal_masuk"){
            if (!empty($filters['range']) && !empty($filters['tanggal_mulai']) && !empty($filters['tanggal_selesai'])) {
                $query->whereBetween(DB::raw('DATE(sep_t.tglsep)'), [$filters['tanggal_mulai'], $filters['tanggal_selesai']]);
            }
        }else if($filters['periode'] === 'tanggal_pulang'){
            if (!empty($filters['range']) && !empty($filters['tanggal_mulai']) && !empty($filters['tanggal_selesai'])) {
                $query->whereBetween(DB::raw('DATE(sep_t.tglpulang)'), [$filters['tanggal_mulai'], $filters['tanggal_selesai']]);
            }
        }else{
            if (!empty($filters['range']) && !empty($filters['tanggal_mulai']) && !empty($filters['tanggal_selesai'])) {
                $query->whereBetween(DB::raw('DATE(inacbg_t.inacbg_tgl)'), [$filters['tanggal_mulai'], $filters['tanggal_selesai']]);
            }
        }
       


        if(!empty($filters['nosep'])){
            $query->where('sep_t.nosep', $filters['nosep']);
        }

        if(!empty($filters['jenisRawat'] === "RI")){
            $query->where('jnspelayanan', "1");

        }else if(!empty($filters['jenisRawat'])){
            $query->where('jnspelayanan', "2");

        }

        if(!empty($filters['kelasRawat'])){
            $query->where('klsrawat', $filters['kelasRawat']);
        }

        if(!empty($filters['nama_pasien'])){
            $query
            ->where('nama_pasien', 'ilike', '%' . $filters['nama_pasien'] . '%');            
        }


        return $query->offset($offset)->limit($limit)->get();
    }

    public static function getTotalItems($filters)
    {
        $query = self::baseQuery();

        if (!empty($filters['range'])) {
            $query->whereBetween('sep_t.tglsep', [$filters['tanggal_mulai'], $filters['tanggal_selesai']]);
        }else if(!empty($filters['nosep'])){
            $query->where('sep_t.nosep', [$filters['nosep']]);
        }

        return $query->count();
    }
}
