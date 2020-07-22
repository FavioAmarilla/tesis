<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ComprobanteItems extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'vta_items_comprob';
    protected $perPage = 10;

    protected $fillable =[
        'id_comprobante',
        'id_producto',
        'precio_venta',
        'costo_unitario',
        'porc_impuesto',
        'total',
        'cantidad',
        'total_exento',
        'total_iva5',
        'total_iva10'
    ];

    public function producto(){
        return $this->hasOne('App\Producto', 'identificador', 'id_producto');
    }

}
