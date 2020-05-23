<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PedidoPagos extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'ec_pedidos_pago';
    protected $perPage = 10;

    protected $fillable =[
        'id_pedido',
        'vr_tipo',
        'total',
        'importe',	
        'vuelto',
    ];

    public function pedido(){
        return $this->hasOne('App\Pedido', 'identificador', 'id_pedido');
    }
}
