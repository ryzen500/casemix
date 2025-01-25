<?php

namespace App\Http\Services;

use App\Models\Casemix\Inacbg;


class groupingService
{

    protected $inacbg;

    public function __construct(Inacbg $inacbg)
    {
        $this->inacbg = $inacbg;
    }
    public function callDataGrouping($nomor_sep)
    {
        // Structur Payload 
        $key_ina = env('INACBG_KEY');

        $data_ina = [
            'nomor_sep' => $nomor_sep,

        ];


        // result kirim claim
        return $this->inacbg->getClaim($data_ina, $key_ina);
    }
}

?>