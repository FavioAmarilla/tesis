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

    public function signIn($email, $clave_acceso, $getToken = null)
    {
        $user = User::where([
            'email'     =>  $email,
            'clave_acceso'  =>  $clave_acceso,
        ])->first();

        $signIn = is_object($user);
        if ($signIn) {
            $token = array(
                'sub'               => $user->identificador,
                'email'             => $user->email,
                'nombre_completo'   => $user->nombre_completo,
                'imagen'            => $user->imagen,
                'iat'               =>  time(),
                'exp'               =>  time() + (7 * 24 * 60 * 60)
            );

            $jwt = JWT::encode($token, $this->key, 'HS256');
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);

            if (is_null($getToken)) {
                return $this->sendResponse(true, 'Autenticacion', $jwt);
            } else {
                return $this->sendResponse(true, 'Autenticacion', $decoded);
            }
        } else {
            return $this->sendResponse(false, 'Acceso denegado', null);
        }
    }

    public function checkToken($jwt){
        $auth = false;

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

}
