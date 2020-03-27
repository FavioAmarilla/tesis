<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EcParamSucursal extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'ec_param_sucursales';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'id_ec_parametro', 'id_sucursal', 'activo'
    ];

    //obtener sucursal
    public function ciudad(){
        return $this->belongsTo('App\Sucursal', 'id_sucursal');
    }

    public function parametro(){
        return $this->belongsTo('App\EcParametros', 'id_ec_parametro');
    }
}
