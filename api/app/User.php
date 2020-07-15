<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'fnd_usuarios';
    protected $primaryKey = 'identificador';
    protected $perPage = 10;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre_completo', 'email', 'clave_acceso', 'imagen', 'fecha_nacimiento', 'telefono', 
        'celular', 'activo', 'id_rol'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function rol(){
        return $this->belongsTo('App\Rol', 'id_rol');
    }

    public function cliente(){
        return $this->hasOne('App\Cliente', 'id_usuario', 'identificador');
    }
}
