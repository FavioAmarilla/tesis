<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use App\Http\Controllers\BaseController as BaseController;
use App\User;

class UserController extends BaseController {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        $query = User::all();

        $nombre_completo = $request->query('nombre_completo');
        if ($nombre_completo) {
            $query->where('nombre_completo', 'LIKE', '%'.$nombre_completo.'%');
        }

        $email = $request->query('email');
        if ($email) {
            $query->where('email', 'LIKE', '%'.$email.'%');
        }

        $paginar = $request->query('paginar');
        if ($paginar) {
            $data = $query->orderBy('nombre_completo','asc')->paginate(5);
        }else{
            $data = $query->orderBy('nombre_completo','asc')->get();
        }
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request) {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $nombre_completo = $request->input("nombre_completo");
        $email = $request->input("email");
        $clave_acceso = hash('sha256', $request->input("clave_acceso"));
        $imagen = $request->file('imagen');
        $image_name = time().$imagen->getClientOriginalName();

        $validator = Validator::make($request->all(), [
            'nombre_completo'  => 'required',
            'email'  => 'required',
            'clave_acceso'  => 'required',
            'imagen'   =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $usuario = new User();
        $usuario->nombre_completo = $nombre_completo;
        $usuario->email = $email;
        $usuario->clave_acceso = $clave_acceso;
        $usuario->imagen = $image_name;

        if ($usuario->save()) {
            Storage::disk('usuarios')->put($image_name, \File::get($imagen));
            return $this->sendResponse(true, 'Usuario registrado', $usuario);
        }else{
            return $this->sendResponse(false, 'Usuario no registrado', null);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $user = User::find($id);

        if (is_object($user)) {
            return $this->sendResponse($user, 'Success');
        }else{
            return $this->sendError('El usuario no existe', null);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {
        $nombre_completo = $request->input("nombre_completo");
        $email = $request->input("email");
        $clave_acceso = hash('sha256', $request->input("clave_acceso"));
        $imagen = $request->file('imagen');
        $image_name = time().$imagen->getClientOriginalName();

        $validator = Validator::make($request->all(), [
            'nombre_completo'  => 'required',
            'email'  => 'required',
            'clave_acceso'  => 'required',
            'imagen'   =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $usuario = User::find($id);
        if ($usuario) {
            $usuario->nombre_completo = $nombre_completo;
            $usuario->email = $email;
            $usuario->clave_acceso = $clave_acceso;
            $usuario->imagen = $image_name;
    
            if ($usuario->save()) {
                Storage::disk('usuarios')->put($image_name, \File::get($imagen));
                return $this->sendResponse(true, 'Usuario actualizado', $usuario);
            }else{
                return $this->sendResponse(false, 'Usuario no actualizado', null);
            }
        }else{
            return $this->sendResponse(false, 'No se encontro el Usuario', null);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request) {
        $user = User::find($id);
        $json = $request->input('json', null);
        $input = json_decode($json, true);

        if ($user) {
            $user->estado = $input['estado'];
            
            if ($user->update()) {
                return $this->sendResponse($user, 'Usuario actualizado');
            }

            return $this->sendResponse($user, 'Hubo un problema al intentar desactivar el usuario');
        }

        return $this->sendError('No se ha encontrado el usuario', null);
    }


    public function signIn(Request $request) {
        $jwtAuth = new \JwtAuth();
        $json = $request->input('json', null);
        $array = json_decode($json, true);
            
        $validator = Validator::make($array, [
            'email'     =>  'required|email',
            'clave_acceso'  =>  'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }else{
            $pwd = hash('sha256', $array['clave_acceso']);
            if (!empty($array['getToken'])) {
                $data = $jwtAuth->signIn($array['email'], $pwd, true);
            }else{
                $data = $jwtAuth->signIn($array['email'], $pwd);
            }
        }

        return $data;
    }

    public function checkToken(Request $request) {
        $token = $request->header('Authorization');
            
        $jwt = new \JwtAuth();
        $user = $jwt->checkToken($token, true);

        return $this->sendResponse($user, '');
    }

    public function getImage($filename){
        $isset = \Storage::disk('usuarios')->exists($filename);
        if ($isset) {
            $file = \Storage::disk('usuarios')->get($filename);
            return new Response($file);
        }else{
            return $this->sendError('La imagen no existe', null);
        }
    }
}
