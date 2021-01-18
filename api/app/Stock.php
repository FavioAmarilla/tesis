<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'pr_stock';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'id_sucursal', 'id_producto', 'stock'
    ];

    //obtener sucursal
    public function sucursal(){
        return $this->belongsTo('App\Sucursal', 'id_sucursal');
    }

    //obtener [producto
    public function producto(){
        return $this->belongsTo('App\Producto', 'id_producto');
    }

    
}
