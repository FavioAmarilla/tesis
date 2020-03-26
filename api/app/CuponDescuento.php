<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CuponDescuento extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'vta_cupones_descuento';
    protected $perPage = 10;

    protected $fillable =[
        'identificador',
        'descripcion',
        'porc_descuento',
        'codigo',
        'fecha_desde',
        'fecha_hasta',
        'usado'
    ];
}
