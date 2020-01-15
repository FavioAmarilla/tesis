<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'pr_productos';

    protected $fillable =[
        'identificador', 'id_linea', 'id_tipo_impuesto', 'vr_unidad_medida', 'descripcion', 'codigo_barras', 'costo_unitario', 'precio_venta', 'archivo_img',
    ];

    //obtener linea de producto
    public function lineaProducto(){
        return $this->belongsTo('App\LineaProducto', 'id_linea');
    }

    //obtener tipo deimpuesto
    public function tipoImpuesto(){
        return $this->belongsTo('App\TipoImpuesto', 'id_tipo_impuesto');
    }
}
