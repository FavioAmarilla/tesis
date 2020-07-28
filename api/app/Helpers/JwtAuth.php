<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\User;
use App\Http\Controllers\BaseController as BaseController;

class JwtAuth extends BaseController
{
    public $key;

    public function __construct()
    {
        $this->key = 'api-ecommerce-sy';
    }

    public function signIn($device, $email, $clave_acceso, $getToken = null)
    {
        $user = User::with(['rol', 'rol.permisos'])->where([
            'email'     =>  $email,
            'clave_acceso'  =>  $clave_acceso,
            'activo' => 'S'
        ])->first();

        $signIn = is_object($user);
        $roles = ['ADMINISTRADOR', 'CLIENTE'];
        if ($device == 'admin-website') {
            $roles = ['ADMINISTRADOR', 'PEDIDO', 'CARGA', 'PRODUCTOS'];
        }
        
        if ($signIn && $user->authorizeRoles($roles)) {
            $token = array(
                'sub'               => $user->identificador,
                'usuario'           => $user,
                'iat'               =>  time(),
                'exp'               =>  time() + (7 * 24 * 60 * 60)
            );

            $jwt = JWT::encode($token, $this->key, 'HS256');
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);

            if (is_null($getToken)) {
                return $this->sendResponse(true, 'Autenticacion', $jwt, 200);
            }
            
            return $this->sendResponse(true, 'Autenticacion', $decoded, 200);
        }
        
        return $this->sendResponse(false, 'Acceso denegado', null, 403);
    }

    public function checkToken($jwt){
        $auth = false;
        $decoded = null;

        if ($jwt) {
            try {
                $jwt = str_replace('"', '', $jwt);
                $decoded = JWT::decode($jwt, $this->key, ['HS256']);
            } catch (\UnexpectedValueException $e) {
                $auth = false;
            } catch (\DomainException $e) {
                $auth = false;
            }

            if (!empty($decoded) && is_object($decoded) && isset($decoded->sub)) {
                $auth = true;
            }else{
                $auth = false;
            }

            $auth = $decoded;
            return $auth;
        }
        
        return null;
    }

}
