<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RecuperarContrasenha extends Model
{
    protected $table = 'password_resets';

    protected $fillable = [
        'email', 'token'
    ];
}
