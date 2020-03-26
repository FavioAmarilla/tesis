<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pais extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'geo_paises';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'nombre',
    ];

    //obtener ciudades de un pais
    public function ciudad(){
        return $this->hasMany('App\Ciudad');
    }

    //obtener todas las sucursales de un pais
    public function sucursales(){
        return $this->hasMany('App\Sucursal');
    }

    //obtener todos los parametros de un pais
    public function parametros(){
        return $this->hasMany('App\EcParametros');
    }
}
