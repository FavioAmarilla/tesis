<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comprobante extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'vta_comprobantes';
    protected $perPage = 10;

    protected $fillable =[
        'id_pedido', 'id_sucursal', 'id_timbrado', 'id_punto_emision', 'id_cliente', 'numero', 
        'numero_ticket', 'monto_total', 'monto_exento', 'monto_iva5', 'monto_iva10', 'usr_anulacion', 
        'fec_anulacion', 'descuento'

    ];

    public function detalles() {
        return $this->hasMany('App\ComprobanteItems', 'id_comprobante', 'identificador');
    }
    
}
