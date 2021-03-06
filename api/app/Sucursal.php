<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_sucursales';
    protected $perPage = 10;
    
    protected $fillable = [
        'identificador', 'id_empresa', 'codigo', 'nombre', 'telefono', 
        'id_pais', 'id_ciudad', 'direccion', 'ecommerce', 'central'
    ];

    //obtener todos los puntos de emision de una sucursal
    public function puntosEmision(){
        return $this->hasMany('App\PuntoEmision');
    }

    //obtener empresa de la sucursal
    public function empresa(){
        return $this->belongsTo('App\Empresa', 'id_empresa');
    }

    //obtener pais de la sucursal
    public function pais(){
        return $this->belongsTo('App\Pais', 'id_pais');
    }

    //obtener ciudad de la sucursal
    public function ciudad(){
        return $this->belongsTo('App\Ciudad', 'id_ciudad');
    }

     //obtener todos los parametros por sucursal
     public function parametros(){
        return $this->hasMany('App\EcParamSucursal');
    }
}
