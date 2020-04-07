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

    //obtener items de pedido
    public function items(){
        return $this->hasMany('App\PedidoItems');
    }
}
