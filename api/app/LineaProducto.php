<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LineaProducto extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'pr_lineas_prod';
    protected $perPage = 10;

    protected $fillable = [
        'identificador', 'descripcion', 'archivo_img',
    ];

    //obtener productos de una linea
    public function productos(){
        return $this->hasMany('App\Producto');
    }
}
