<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Barrio extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'geo_barrios';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'id_ciudad', 'nombre',
    ];

    //obtener ciudad de un barrio
    public function ciudad(){
        return $this->belongsTo('App\Ciudad', 'id_ciudad');
    }

}
