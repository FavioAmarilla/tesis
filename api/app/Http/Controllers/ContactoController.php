<?php

namespace App\Http\Controllers;

use Validator;

use App\Mail\Contacto;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\BaseController as BaseController;

class ContactoController extends BaseController
{

    

    /**
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function send(Request $request)
    {
        $nombre = $request->input('nombre');
        $email = $request->input('email');
        $asunto = $request->input('asunto');
        $mensaje = $request->input('mensaje');

        $validator = Validator::make($request->all(), [
            'nombre'  => 'required',
            'email'  => 'required',
            'asunto'  => 'required',
            'mensaje'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }
        
        $data = [
            'nombre' => $nombre,
            'email' => $email,
            'asunto' => $asunto,
            'mensaje' => $mensaje
        ];

        Mail::to(env('MAIL_FROM_ADDRESS'))->send(new Contacto($data));

        return $this->sendResponse(true, 'Email enviado correctamente', null, 200);
    }

}
