<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_permisos';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'nombre', 'id_rol'
    ];

}
