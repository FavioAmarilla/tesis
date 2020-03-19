<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoImpuesto extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_tipos_impuesto';
    protected $perPage = 10;
    
    protected $fillable = [
        'identificador', 'descripcion', 'valor',
    ];

    //obtener productos de un tipo de impuesto
    public function productos(){
        return $this->hasMany('App\Producto');
    }
}
