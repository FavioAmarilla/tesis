<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'pr_productos';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'id_linea', 'id_tipo_impuesto', 'id_marca', 
        'vr_unidad_medida', 'descripcion', 'codigo_barras', 'costo_unitario', 
        'precio_venta', 'imagen',
    ];

    //obtener linea de producto
    public function lineaProducto(){
        return $this->belongsTo('App\LineaProducto', 'id_linea');
    }

    //obtener tipo de impuesto
    public function tipoImpuesto(){
        return $this->belongsTo('App\TipoImpuesto', 'id_tipo_impuesto');
    }

    //obtener tipo marca
    public function marca(){
        return $this->belongsTo('App\Marca', 'id_marca');
    }
    
    //obtener stock
    public function stock(){
        return $this->hasOne('App\Stock', 'id_producto');
    }
}
