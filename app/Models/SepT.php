<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SepT extends Model
{
    use HasFactory;


    public static function getSep( $nosep)
    {
        // $query = self::buildBaseQueryGrouping();
        $query = DB::table('sep_t as s')
                ->select(
                    DB::raw('p.pendaftaran_id,s.*'),
                    DB::raw("CASE
                        WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim'::text
                        WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN 'Final'::text
                        WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN '-'::text
                        ELSE '-'::text
                        END AS status"),
                    DB::raw('pg.nama_pegawai, inasiscbg_t.kodeprosedur AS cbg'),
                    DB::raw('pm.nama_pasien, pm.no_rekam_medik,pm.jeniskelamin,pm.tanggal_lahir')

                )
                ->join('pendaftaran_t as p', 's.sep_id', '=', 'p.sep_id')
                ->join('pasien_m as pm', 'pm.pasien_id', '=', 'p.pasien_id')
                ->leftJoin('inacbg_t', 'inacbg_t.sep_id', '=', 'p.sep_id')
                ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
                ->leftJoin('pegawai_m as pg', 'pg.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
                ->where('s.nosep', $nosep);
                // ->where('s.nosep', '=', "'".$nosep."'");
        return $query->first();

    }
    private static function buildBaseQuery(bool $isSecondQuery = false)
    {
        
        if($isSecondQuery==true){
            $query = DB::table('sep_t')
            ->join('pendaftaran_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
            ->join('pasienadmisi_t', 'pasienadmisi_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->join('pasien_m', 'pasienadmisi_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->leftJoin('suratperintahranap_t', 'suratperintahranap_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('ruangan_m', 'ruangan_m.ruangan_id', '=', 'pasienadmisi_t.ruangan_id')
            ->leftJoin('instalasi_m', 'instalasi_m.instalasi_id', '=', 'ruangan_m.instalasi_id')
            ->leftJoin('inacbg_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->leftJoin('pegawai_m', 'pegawai_m.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
            ->select(
                'pendaftaran_t.tgl_pendaftaran AS tgl_masuk',
                'pendaftaran_t.tgl_pendaftaran AS tgl_pulang',
                'sep_t.sep_id',
                'sep_t.nosep',
                'sep_t.nokartuasuransi',
                'pasien_m.no_rekam_medik',
                'pasien_m.nama_pasien',
                'inasiscbg_t.kodeprosedur',
                'inasiscbg_t.plafonprosedur',
                'inacbg_t.total_tarif_rs',
                'sep_t.jnspelayanan',
                DB::raw("CASE 
                            WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim'
                            WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN 'Final'
                            WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN '-'
                            ELSE NULL
                        END AS status"),
                'inacbg_t.create_loginpemakai_id AS inacbg_loginpemakai_id',
                'pegawai_m.nama_pegawai'
            ); 

        }else{
            
            $query =DB::table('sep_t')
            ->join('pendaftaran_t', 'pendaftaran_t.sep_id', '=', 'sep_t.sep_id')
            ->join('pasien_m', 'pendaftaran_t.pasien_id', '=', 'pasien_m.pasien_id')
            ->leftJoin('suratperintahranap_t', 'suratperintahranap_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('ruangan_m', 'ruangan_m.ruangan_id', '=', 'pendaftaran_t.ruangan_id')
            ->leftJoin('instalasi_m', 'instalasi_m.instalasi_id', '=', 'ruangan_m.instalasi_id')
            ->leftJoin('inacbg_t', 'inacbg_t.pendaftaran_id', '=', 'pendaftaran_t.pendaftaran_id')
            ->leftJoin('inasiscbg_t', 'inasiscbg_t.inacbg_id', '=', 'inacbg_t.inacbg_id')
            ->leftJoin('pegawai_m', 'pegawai_m.loginpemakai_id', '=', 'inacbg_t.create_loginpemakai_id')
            ->select(
                'pendaftaran_t.tgl_pendaftaran AS tgl_masuk',
                'pendaftaran_t.tgl_pendaftaran AS tgl_pulang',
                'sep_t.sep_id',
                'sep_t.nosep',
                'sep_t.nokartuasuransi',
                'pasien_m.no_rekam_medik',
                'pasien_m.nama_pasien',
                'inasiscbg_t.kodeprosedur',
                'inasiscbg_t.plafonprosedur',
                'inacbg_t.total_tarif_rs',
                'sep_t.jnspelayanan',
                DB::raw("CASE 
                            WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true THEN 'Terkirim'
                            WHEN inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false THEN 'Final'
                            WHEN inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false THEN '-'
                            ELSE NULL
                        END AS status"),
                'inacbg_t.create_loginpemakai_id AS inacbg_loginpemakai_id',
                'pegawai_m.nama_pegawai'
            )
            ->whereNull('pendaftaran_t.pasienadmisi_id')
            ->whereNull('pendaftaran_t.pasienbatalperiksa_id');
        }

        return $query;
    }

    public static function dataListSep(int $limit, int $offset, array $filters = [])
    {
        $query1 = self::buildBaseQuery();
        if (!empty($filters)) {
            if (!empty($filters['periode']) || !empty($filters['kelasRawat']) || !empty($filters['jenisrawat'] ) || !empty($filters['nosep'] ) || !empty($filters['nama_pasien'] )) {

                if (!empty($filters['kelasRawat']) && $filters['kelasRawat'] != 'Semua Kelas') {
                    $query1->where('klsrawat', '=', $filters['kelasRawat']);
                } 

                if (!empty($filters['jenisrawat']) && $filters['jenisrawat'] != 'semua') {
                     if($filters['jenisrawat']=='RI'){
                        $query1->where('jnspelayanan', '=', 1);
                    }else if($filters['jenisrawat']=='RJ'){
                        $query1->where('jnspelayanan', '=', 2);
                    }
                }
                if (!empty($filters['status']) && $filters['status'] != 'semua') {
                    if($filters['status']=='belum_grouping'){
                        $query1->whereNull('inacbg_t.inacbg_id');
                    }else if($filters['status']=='normal'){
                        $query1->whereRaw('(inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false)');
                    }else if($filters['status']=='final'){
                        $query1->whereRaw('(inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false)');
                    }else if($filters['status']=='terkirim'){
                        $query1->whereRaw('(inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true)');
                    }
                } 
                if (!empty($filters['nosep'])) {
                    $query1->whereRaw('LOWER(sep_t.nosep) LIKE ?', ['%' . strtolower($filters['nosep']) . '%']);
                }
                if (!empty($filters['nama_pasien'])) {
                    $query1->whereRaw('LOWER(pasien_m.nama_pasien) LIKE ?', ['%' . strtolower($filters['nama_pasien']) . '%']);
                }
                if ($filters['periode'] == 'tanggal_pulang') {
                    $query1->whereBetween(
                        DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } else if ($filters['periode'] == 'tanggal_masuk') {
                    $query1->whereBetween(
                        DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } 
            } else {
                if (isset($filters['query'])) {
                    $value = $filters['query'];
                    $query1->whereRaw('LOWER(pa.nama_pasien) LIKE ?', ['%' . strtolower($value) . '%'])
                        ->orWhereRaw('(s.nosep) LIKE ?', ['%' . ($value) . '%'])
                        ->orWhereRaw('(pa.no_rekam_medik) LIKE ?', ['%' . ($value) . '%']);
                    $query1->orderBy('pa.nama_pasien','asc');
                }
            }
        }
        $query2 = self::buildBaseQuery(isSecondQuery: true);
        if (!empty($filters)) {
            if (!empty($filters['periode']) || !empty($filters['kelasRawat']) || !empty($filters['jenisrawat'] ) || !empty($filters['nosep'] ) || !empty($filters['nama_pasien'] )) {

                if (!empty($filters['kelasRawat']) && $filters['kelasRawat'] != 'Semua Kelas') {
                    $query2->where('klsrawat', '=', $filters['kelasRawat']);
                } 
                if (!empty($filters['jenisrawat']) && $filters['jenisrawat'] != 'semua') {
                    if($filters['jenisrawat']=='RI'){
                       $query2->where('jnspelayanan', '=', 1);
                   }else if($filters['jenisrawat']=='RJ'){
                       $query2->where('jnspelayanan', '=', 2);
                   }
               }
                if (!empty($filters['status']) && $filters['status'] != 'semua') {
                    if($filters['status']=='belum_grouping'){
                        $query2->whereNull('inacbg_t.inacbg_id');
                    }else if($filters['status']=='normal'){
                        $query2->whereRaw('(inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false)');
                    }else if($filters['status']=='final'){
                        $query2->whereRaw('(inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false)');
                    }else if($filters['status']=='terkirim'){
                        $query2->whereRaw('(inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true)');
                    }
                } 
                if (!empty($filters['nosep'])) {
                    $query2->whereRaw('LOWER(sep_t.nosep) LIKE ?', ['%' . strtolower($filters['nosep']) . '%']);
                }
                if (!empty($filters['nama_pasien'])) {
                    $query2->whereRaw('LOWER(pasien_m.nama_pasien) LIKE ?', ['%' . strtolower($filters['nama_pasien']) . '%']);
                } 
                if ($filters['periode'] == 'tanggal_pulang') {
                    $query2->whereBetween(
                        DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } else if ($filters['periode'] == 'tanggal_masuk') {
                    $query2->whereBetween(
                        DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } 
            } else {
                if (isset($filters['query'])) {
                    $value = $filters['query'];
                    $query2->whereRaw('LOWER(pa.nama_pasien) LIKE ?', ['%' . strtolower($value) . '%'])
                        ->orWhereRaw('(s.nosep) LIKE ?', ['%' . ($value) . '%'])
                        ->orWhereRaw('(pa.no_rekam_medik) LIKE ?', ['%' . ($value) . '%']);
                    $query2->orderBy('pa.nama_pasien','asc');
                }
            }
        }
        $finalQuery = $query1->unionAll($query2);
        // $query1->limit =10000;
        return $finalQuery
            ->limit($limit)
            ->offset($offset)
            ->get();
    }
    public static function dataListSepCount(array $filters = [])
    {


        $query1 = self::buildBaseQuery();
        if (!empty($filters)) {
            if (!empty($filters['periode']) || !empty($filters['kelasRawat']) || !empty($filters['jenisrawat'] ) || !empty($filters['nosep'] ) || !empty($filters['nama_pasien'] )) {
                if (!empty($filters['kelasRawat']) && $filters['kelasRawat'] != 'Semua Kelas') {
                    $query1->where('klsrawat', '=', $filters['kelasRawat']);

                } 
                if (!empty($filters['jenisrawat']) && $filters['jenisrawat'] != 'semua') {
                    if($filters['jenisrawat']=='RI'){
                       $query1->where('jnspelayanan', '=', 1);
                   }else if($filters['jenisrawat']=='RJ'){
                       $query1->where('jnspelayanan', '=', 2);
                   }
               }
                if (!empty($filters['status']) && $filters['status'] != 'semua') {
                    if($filters['status']=='belum_grouping'){
                        $query1->whereNull('inacbg_t.inacbg_id');
                    }else if($filters['status']=='normal'){
                        $query1->whereRaw('(inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false)');
                    }else if($filters['status']=='final'){
                        $query1->whereRaw('(inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false)');
                    }else if($filters['status']=='terkirim'){
                        $query1->whereRaw('(inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true)');
                    }
                } 
                if (!empty($filters['nosep'])) {
                    $query1->whereRaw('LOWER(sep_t.nosep) LIKE ?', ['%' . strtolower($filters['nosep']) . '%']);
                }
                if (!empty($filters['nama_pasien'])) {
                    $query1->whereRaw('LOWER(pasien_m.nama_pasien) LIKE ?', ['%' . strtolower($filters['nama_pasien']) . '%']);
                } 
                if ($filters['periode'] == 'tanggal_pulang') {
                    $query1->whereBetween(
                        DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } else if ($filters['periode'] == 'tanggal_masuk') {
                    $query1->whereBetween(
                        DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } 
            } else {
                if (isset($filters['query'])) {
                    $value = $filters['query'];
                    $query1->whereRaw('LOWER(pa.nama_pasien) LIKE ?', ['%' . strtolower($value) . '%'])
                        ->orWhereRaw('(s.nosep) LIKE ?', ['%' . ($value) . '%'])
                        ->orWhereRaw('(pa.no_rekam_medik) LIKE ?', ['%' . ($value) . '%']);
                    $query1->orderBy('pa.nama_pasien','asc');
                }
            }
        }
        $query2 = self::buildBaseQuery(isSecondQuery: true);
        if (!empty($filters)) {
            if (!empty($filters['periode']) || !empty($filters['kelasRawat']) || !empty($filters['jenisrawat'] ) || !empty($filters['nosep'] ) || !empty($filters['nama_pasien'] )) {

                if (!empty($filters['kelasRawat']) && $filters['kelasRawat'] != 'Semua Kelas') {
                    $query2->where('klsrawat', '=', $filters['kelasRawat']);
                } 
                if (!empty($filters['jenisrawat']) && $filters['jenisrawat'] != 'semua') {
                    if($filters['jenisrawat']=='RI'){
                       $query2->where('jnspelayanan', '=', 1);
                   }else if($filters['jenisrawat']=='RJ'){
                       $query2->where('jnspelayanan', '=', 2);
                   }
               }
                if (!empty($filters['status']) && $filters['status'] != 'semua') {
                    if($filters['status']=='belum_grouping'){
                        $query2->whereNull('inacbg_t.inacbg_id');
                    }else if($filters['status']=='normal'){
                        $query2->whereRaw('(inacbg_t.is_finalisasi = false AND inacbg_t.is_terkirim = false)');
                    }else if($filters['status']=='final'){
                        $query2->whereRaw('(inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = false)');
                    }else if($filters['status']=='terkirim'){
                        $query2->whereRaw('(inacbg_t.is_finalisasi = true AND inacbg_t.is_terkirim = true)');
                    }
                } 
                if (!empty($filters['nosep'])) {
                    $query2->whereRaw('LOWER(sep_t.nosep) LIKE ?', ['%' . strtolower($filters['nosep']) . '%']);
                } 
                if (!empty($filters['nama_pasien'])) {
                    $query2->whereRaw('LOWER(pasien_m.nama_pasien) LIKE ?', ['%' . strtolower($filters['nama_pasien']) . '%']);
                } 
                if ($filters['periode'] == 'tanggal_pulang') {
                    $query2->whereBetween(
                        DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } else if ($filters['periode'] == 'tanggal_masuk') {
                    $query2->whereBetween(
                        DB::raw('DATE(pendaftaran_t.tgl_pendaftaran)'), // Use DATE() for ensuring the format is consistent
                        [
                            date('Y-m-d', strtotime($filters['tanggal_mulai'])), // Convert to 'YYYY-MM-DD' format
                            date('Y-m-d', strtotime($filters['tanggal_selesai'])) // Convert to 'YYYY-MM-DD' format
                        ]
                    );
                } 
            } else {
                if (isset($filters['query'])) {
                    $value = $filters['query'];
                    $query2->whereRaw('LOWER(pa.nama_pasien) LIKE ?', ['%' . strtolower($value) . '%'])
                        ->orWhereRaw('(s.nosep) LIKE ?', ['%' . ($value) . '%'])
                        ->orWhereRaw('(pa.no_rekam_medik) LIKE ?', ['%' . ($value) . '%']);
                    $query2->orderBy('pa.nama_pasien','asc');
                }
            }
        }
        $finalQuery = $query1->unionAll($query2);
        return $finalQuery->count();
    }
}
