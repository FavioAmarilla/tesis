<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PuntoEmision extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'vta_puntos_emision';
    
    protected $fillable = [
        'identificador', 'nombre', 'codigo', 'vr_tipo',
    ];
}
