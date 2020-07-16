<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PedidoItems extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'ec_pedidos_items';
    protected $perPage = 10;

    protected $fillable =[
        'id_pedido',
        'id_producto',
        'cantidad',
        'precio_venta',
        'importe_exento',
        'importe_iva5',
        'importe_iva10',
        'activo'
    ];

    public function producto(){
        return $this->hasOne('App\Producto', 'identificador', 'id_producto');
    }

    public function pedido(){
        return $this->hasOne('App\Pedido', 'identificador', 'id_pedido');
    }
}
