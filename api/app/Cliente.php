<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $primaryKey = 'identificador';
    protected $table = 'vta_clientes';
    protected $perPage = 10;

    protected $fillable =[
        'id_usuario',
        'razon_social',
        'numero_documento',
        'celular',
        'telefono'
    ];

    //obtener usuario del cliente
    public function usuario(){
        return $this->belongsTo('App\User', 'id_usuario');
    }

}
