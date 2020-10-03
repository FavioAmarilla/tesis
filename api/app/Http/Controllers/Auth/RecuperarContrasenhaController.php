<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Carbon\Carbon;
use App\RecuperarContrasenha;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Notifications\RecuperarContrasenhaRequest;
use App\Notifications\RecuperarContrasenhaSuccess;

class RecuperarContrasenhaController extends Controller
{
    /**
     * Create token password reset
     *
     * @param  [string] email
     * @return [string] message
     */
    public function crearToken(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No podemos encontrar una cuenta con ese correo electronico.'
            ], 404);
        }

        $passwordReset = RecuperarContrasenha::updateOrCreate(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => Str::random(60)
            ]
        );

        if ($user && $passwordReset) $user->notify(new RecuperarContrasenhaRequest($passwordReset->token));

        return response()->json([
            'success' => true,
            'message' => 'Te hemos enviado un correo con el enlace para reestablecer el correo electronico'
        ]);
    }

    /**
     * Find token password reset
     *
     * @param  [string] $token
     * @return [string] message
     * @return [json] passwordReset object
     */
    public function buscarToken($token)
    {
        $passwordReset = RecuperarContrasenha::where('token', $token)->first();

        if (!$passwordReset) {
            return response()->json([
                'success' => false,
                'message' => 'El token no es valido.'
            ], 404);
        }

        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
            $passwordReset->delete();
            return response()->json([
                'success' => false,
                'message' => 'El token es para reestablecer la contraseña no es valido.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $passwordReset
        ]);
    }

     /**
     * Reset password
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @param  [string] token
     * @return [string] message
     * @return [json] user object
     */
    public function reestablecer(Request $request)
    {
        $request->validate([
            'password' => 'required|string|confirmed',
            'token' => 'required|string'
        ]);

        $passwordReset = RecuperarContrasenha::where('token', $request->token)->first();

        if (!$passwordReset) {
            return response()->json([
                'success' => false,
                'message' => 'El token no es valido.'
            ], 404);
        }
        
        $user = User::where('email', $passwordReset->email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No podemos encontrar una cuenta con ese correo electronico.'
            ], 404);
        }

        $user->clave_acceso = bcrypt($request->password);
        $user->save();

        $passwordReset->delete();
        $user->notify(new RecuperarContrasenhaSuccess($passwordReset));

        return response()->json([
            'success' => true,
            'usuario' => $user
        ]);
    }
}