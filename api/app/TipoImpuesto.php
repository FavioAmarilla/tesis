<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoImpuesto extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_tipos_impuesto';
    
    protected $fillable = [
        'identificador', 'descripcion', 'valor',
    ];

    //obtener productos de un tipo de impuesto
    public function productos(){
        return $this->hasMany('App\Producto');
    }
}
