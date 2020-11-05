<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EcPregunta extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'ec_preguntas';
    protected $perPage = 10;

    protected $fillable = [
        'identificador', 'pregunta', 'respuesta',
    ];
}
