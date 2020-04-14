<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'ec_pedidos';
    protected $perPage = 10;

    protected $fillable =[
        'identificador',
        'id_cupon_descuento',
        'id_usuario',
        'id_sucursal',
        'fecha',
        'id_pais',
        'id_ciudad',
        'id_barrio',
        'direccion',
        'latitud',
        'longitud',
        'costo_envio',
        'total',
        'observacion',
        'tipo_envio',
        'estado'	
    ];

    public function items(){
        return $this->hasOne('App\PedidoItems', 'id_pedido', 'identificador');
    }

    public function sucursal(){
        return $this->hasOne('App\Sucursal', 'identificador', 'id_sucursal');
    }

    public function cupon(){
        return $this->hasOne('App\CuponDescuento', 'identificador', 'id_cupon_descuento');
    }

    public function pais(){
        return $this->hasOne('App\Pais', 'identificador', 'id_pais');
    }

    public function ciudad(){
        return $this->hasOne('App\Ciudad', 'identificador', 'id_ciudad');
    }

    public function barrio(){
        return $this->hasOne('App\Barrio', 'identificador', 'id_barrio');
    }
}
