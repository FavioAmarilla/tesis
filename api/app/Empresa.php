<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_parm_empresas';

    protected $fillable =[
        'identificador',
        'nombre',
        'numero_documento',
        'telefono',
        'pais',
        'ciudad',
        'direccion',
        'imagen'
    ];
}
