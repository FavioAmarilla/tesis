<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EcParamCiudades extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'ec_param_ciudades';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'id_ec_parametro', 'id_ciudad', 'activo'
    ];

    //obtener ciudad
    public function ciudad(){
        return $this->belongsTo('App\Ciudad', 'id_ciudad');
    }

    public function parametro(){
        return $this->belongsTo('App\EcParametros', 'id_ec_parametro');
    }
}
