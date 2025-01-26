<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inasiscbg extends Model
{
    use HasFactory;

    protected $table = 'inasiscbg_t';

    public $timestamps = false;
    protected $primaryKey = 'inasiscbg_id';

    protected $fillable = [

        'pendaftaran_id',
        'inacbg_id',
        'inasiscbg_tgl',
        'kodeprosedur',
        'namaprosedur',
        'plafonprosedur',
        'create_time',
        'create_loginpemakai_id',
        'create_ruangan'
    ];
}
