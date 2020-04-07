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
        'observacion',
        'estado'	
    ];

    public function items(){
        return $this->hasOne('App\PedidoItems', 'id_pedido');
    }

    public function sucursal(){
        return $this->hasOne('App\Sucursal', 'id_sucursal');
    }

    public function cupon(){
        return $this->hasOne('App\CuponDescuento', 'id_cupon_descuento');
    }

    public function pais(){
        return $this->hasOne('App\Pais', 'id_pais');
    }

    public function ciudad(){
        return $this->hasOne('App\Ciudad', 'id_ciudad');
    }

    public function barrio(){
        return $this->hasOne('App\Barrio', 'id_barrio');
    }
}
