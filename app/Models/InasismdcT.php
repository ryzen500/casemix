<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InasismdcT extends Model
{
    use HasFactory;

    protected $table  ='inasismdc_t';

    protected $primaryKey = 'inasismdc_id';

    protected $fillable = [
        'pendaftaran_id',
        'inacbg_id',
        'inasismdc_tgl',
        'mdc_number',
        'mdc_description',
        'drg_code',
        'drg_description',
        'create_time',
        'update_time',
        'create_loginpemakai_id',
        'update_loginpemakai_id',
        'create_ruangan'
    ];

    public $timestamps = false;
}
