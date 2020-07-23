<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserTarjetas extends Model
{
    protected $table = 'fnd_usuarios_tarjetas';
    protected $primaryKey = 'identificador';
    protected $perPage = 10;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_usuario'
    ];
}
