<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AsignacionComprobante extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'vta_asignacion_comp';
    protected $perPage = 10;

    protected $fillable =[
        'id_timbrado',
        'id_punto_emision',
        'ult_usado'
    ];
}
