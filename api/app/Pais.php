<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pais extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'geo_paises';

    protected $fillable =[
        'identificador', 'nombre',
    ];

    //obtener ciudades de un pais
    public function ciudad(){
        return $this->hasMany('App\Ciudad');
    }
}
