<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'fnd_parm_empresas';

    protected $fillable =[
        'identificador',
        'codigo',
        'nombre',
        'numero_documento',
        'imagen'
    ];

    //obtener todas las sucursales de una empresa
    public function sucursales(){
        return $this->hasMany('App\Sucursal');
    }
}
