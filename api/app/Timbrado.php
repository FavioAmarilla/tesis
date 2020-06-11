<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Timbrado extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'vta_timbrados';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'numero', 'numero_desde', 'numero_hasta', 'fecha_desde', 'fecha_hasta'

    ];

}
