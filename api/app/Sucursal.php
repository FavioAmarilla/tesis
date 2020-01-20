<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_sucursales';
    
    protected $fillable = [
        'identificador', 'id_empresa', 'codigo', 'nombre', 'telefono', 'id_pais', 'id_ciudad', 'direccion', 'ecommerce'
    ];

    //obtener todos los puntos de emision de una sucursal
    public function puntosEmision(){
        return $this->hasMany('App\PuntoEmision');
    }

    //obtener empresa de la sucursal
    public function empresa(){
        return $this->belongsTo('App\LineaProducto', 'id_empresa');
    }

    //obtener pais de la sucursal
    public function pais(){
        return $this->belongsTo('App\LineaProducto', 'id_pais');
    }

    //obtener ciudad de la sucursal
    public function ciudad(){
        return $this->belongsTo('App\LineaProducto', 'id_ciudad');
    }
}
