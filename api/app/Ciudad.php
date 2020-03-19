<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ciudad extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'geo_ciudades';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'id_pais', 'nombre',
    ];

    //obtener barrios de una ciudad
    public function barrio(){
        return $this->hasMany('App\Barrio');
    }

    //obtener pais de una ciudad
    public function pais(){
        return $this->belongsTo('App\Pais', 'id_pais');
    }

    //obtener todas las sucursales de una ciudad
    public function sucursales(){
        return $this->hasMany('App\Sucursal');
    }
}
