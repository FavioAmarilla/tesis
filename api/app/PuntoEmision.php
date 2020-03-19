<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PuntoEmision extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'vta_puntos_emision';
    protected $perPage = 10;
    
    protected $fillable = [
        'identificador', 'nombre', 'codigo', 'vr_tipo', 'id_sucursal'
    ];
    
    //obtener sucursal del punto de emision
    public function sucursal(){
        return $this->belongsTo('App\Sucursal', 'id_sucursal');
    }
}
