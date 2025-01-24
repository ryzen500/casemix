<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DiagnosaicdixM extends Model
{
    use HasFactory;
    public static function getDiagnosaAutocomplete( $value)
    {
        $results = DB::table('diagnosaicdix_m')
        ->select('diagnosaicdix_id', 'diagnosaicdix_kode', 'diagnosaicdix_nama')
        ->where('diagnosaicdix_aktif', true) // Ensuring that the diagnosa is active
        ->where(function($query) use ($value) {
            $query->whereRaw('LOWER(diagnosaicdix_kode) LIKE ?', ['%' . strtolower($value) . '%'])
                ->orWhereRaw('LOWER(diagnosaicdix_nama) LIKE ?', ['%' . strtolower($value) . '%']);
        });
        return $results->get();
    }
    public static function getDiagnosaByCodeAutocomplete( $diagnosa_kode)
    {
        // $query = self::buildBaseQueryGrouping();
        $query = DB::table('diagnosaicdix_m as d')
                ->select('diagnosaicdix_id', 'diagnosaicdix_kode', 'diagnosaicdix_nama')
                ->where('d.diagnosaicdix_aktif', true) // Ensuring that the diagnosa is active
                ->where('d.diagnosaicdix_kode', $diagnosa_kode);
                // ->where('s.nosep', '=', "'".$nosep."'");
        return $query->first();

    }
}
