<?php

namespace App\Http\Middleware;

use Closure;
use App\Http\Controllers\BaseController as BaseController;

class ApiAuthMiddleware extends BaseController
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->header('Authorization');
        $jwt = new \JwtAuth();
        $logueado = $jwt->checkToken($token);

        if ($logueado) {
            $request->request->add(['usuario' => $logueado]);
            return $next($request);
        } else {
            return $this->sendResponse(false, 'Usuario no logueado', null, 400);
        }

    }
}
