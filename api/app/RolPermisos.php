<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RolPermisos extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_rol_permisos';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'id_rol', 'id_permiso'
    ];

    //obtener rol
    public function rol(){
        return $this->belongsTo('App\Rol', 'id_rol');
    }

    //obtener permiso
    public function permiso(){
        return $this->belongsTo('App\Permiso', 'id_permiso');
    }
}
