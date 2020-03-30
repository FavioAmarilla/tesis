<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'pr_marcas';
    protected $perPage = 10;
    
    protected $fillable = [
        'identificador', 'nombre'
    ];

    //obtener productos de un tipo de impuesto
    public function productos(){
        return $this->hasOne('App\Producto', 'id_marca');
    }
}
