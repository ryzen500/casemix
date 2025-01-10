<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class LoginPemakaiK extends Authenticatable
{
    use Notifiable;

    protected $table = 'loginpemakai_k';
    protected $primaryKey = 'loginpemakai_id'; // Adjust if the table uses a different primary key
    public $timestamps = false; // Set to true if timestamps exist

    protected $fillable = ['nama_pemakai', 'katakunci_pemakai']; // Define the columns you allow for mass assignment
    // Define username and password fields for authentication
    public function getAuthIdentifierName()
    {
        return 'nama_pemakai';
    }

    public function getAuthPassword()
    {
        return $this->katakunci_pemakai;
    }
}
