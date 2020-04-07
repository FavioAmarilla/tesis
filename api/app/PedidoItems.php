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
        'precio_venta'	
    ];
}
