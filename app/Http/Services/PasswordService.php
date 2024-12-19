<?php
namespace App\Http\Services;

use Illuminate\Support\Facades\Hash;

class PasswordService
{
    protected $namaPemakai;

    public function __construct($namaPemakai, )
    {
        $this->namaPemakai = $namaPemakai;
    }

    public function disableNTBin($value)
    {
        $hex = bin2hex($value);
        $hex = str_replace("00", "88", $hex);
        return hex2bin($hex);
    }

    public function cekPassword3($value, $katakunciPemakai,$seckey)
    {
        // Membuat hash password
        $pass = hash_hmac("sha256", $value . "&" . $this->namaPemakai, $seckey, true);

        // var_dump($this->seckey);die;
// To make the output readable in var_dump, convert the binary output to hexadecimal
        try {
            // Verifikasi password menggunakan password_verify
            $is_verify = password_verify($pass, base64_decode($katakunciPemakai));
            if (!$is_verify) {
                // Jika gagal, lakukan disableNTBin dan coba lagi
                $pass = $this->disableNTBin($pass);
                return password_verify($pass, base64_decode($katakunciPemakai));
            }
            return $is_verify;
        } catch (\Exception $e) {
            // Jika terjadi exception, lakukan disableNTBin dan coba lagi
            $pass = $this->disableNTBin($pass);
            return password_verify($pass, base64_decode($katakunciPemakai));
        }
    }
}

?>