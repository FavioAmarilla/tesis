<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EcParametros extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'ec_parametros';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'monto_minimo', 'costo_delivery', 'id_pais'
    ];

    //obtener pais
    public function pais(){
        return $this->belongsTo('App\Pais', 'id_pais');
    }

    //obtener sucursales
    public function sucursales(){
        return $this->hasMany('App\EcParamSucursal', 'id_ec_parametro', 'identificador');
    }

    //obtener ciudades
    public function ciudades(){
        return $this->hasMany('App\EcParamCiudades', 'id_ec_parametro', 'identificador');
    }
}
