<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_roles';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'nombre',
    ];

    //obtener permisos
    public function permisos() {
        return $this->hasMany('App\RolPermisos', 'id_rol', 'identificador');
    }
}
