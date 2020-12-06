<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'pg_slides';
    protected $perPage = 10;

    protected $fillable =[
        'identificador', 'titulo', 'descripcion', 'archivo_img', 'id_marca'
    ];

    public function marca(){
        return $this->belongsTo('App\Marca', 'id_marca');
    }
}
