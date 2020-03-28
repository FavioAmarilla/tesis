<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\User;

class UserController extends BaseController {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        $query = User::orderBy('nombre_completo', 'asc');

        $nombre_completo = $request->query('nombre_completo');
        if ($nombre_completo) {
            $query->where('nombre_completo', 'LIKE', '%'.$nombre_completo.'%');
        }

        $email = $request->query('email');
        if ($email) {
            $query->where('email', 'LIKE', '%'.$email.'%');
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->$listar();
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data, 200);
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
        $imagen = $request->input('imagen');

        $validator = Validator::make($request->all(), [
            'nombre_completo'  => 'required',
            'email'  => 'required',
            'clave_acceso'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $usuario = new User();
        $usuario->nombre_completo = $nombre_completo;
        $usuario->email = $email;
        $usuario->clave_acceso = $clave_acceso;
        $usuario->imagen = $imagen;

        if ($usuario->save()) {
            return $this->sendResponse(true, 'Usuario registrado', $usuario, 201);
        }
        
        return $this->sendResponse(false, 'Usuario no registrado', null, 400);
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
            return $this->sendResponse(true, 'Listado obtenido exitosamente', $user, 200);
        }
        
        return $this->sendResponse(false,'El usuario no existe', null, 404);
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
        $imagen = $request->input('imagen');

        $validator = Validator::make($request->all(), [
            'nombre_completo'  => 'required',
            'email'  => 'required',
            'clave_acceso'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $usuario = User::find($id);
        if ($usuario) {
            $usuario->nombre_completo = $nombre_completo;
            $usuario->email = $email;
            $usuario->clave_acceso = $clave_acceso;
            $usuario->imagen = $imagen;
    
            if ($usuario->save()) {
                return $this->sendResponse(true, 'Usuario actualizado', $usuario, 200);
            }

            return $this->sendResponse(false, 'Usuario no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro el Usuario', null, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request) {
        $estado = $request->input("estado");

        $user = User::find($id);
        if ($user) {
            $user->estado = $estado;
            
            if ($user->update()) {
                return $this->sendResponse(true, 'Usuario actualizado', $user, 200);
            }
            
            return $this->sendResponse(false, 'Usuario no actualizado', $user, 400);
        }
        
        return $this->sendResponse(true, 'No se encontro el usuario', $usuario, 404);
    }


    public function signIn(Request $request) {
        $jwtAuth = new \JwtAuth();
        
        $email = $request->input("email");
        $clave_acceso = hash('sha256', $request->input("clave_acceso"));
        $getToken = $request->input("getToken");
            
        $validator = Validator::make($request->all(), [
            'email'     =>  'required|email',
            'clave_acceso'  =>  'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }else{
            if (!empty($getToken)) {
                $data = $jwtAuth->signIn($email, $clave_acceso, true);
            }else{
                $data = $jwtAuth->signIn($email, $clave_acceso);
            }
        }

        return $data;
    }

    public function checkToken(Request $request) {
        $token = $request->get('Authorization');
        $jwt = new \JwtAuth();
        $user = $jwt->checkToken($token);

        if ($user) {
            return $this->sendResponse(true, 'Login exitoso', $user, 200);
        }
        
        return $this->sendResponse(false, 'El usuario no existe', $user, 404);

    }

    public function upload(Request $request){
        $image = $request->file('file0');

        $validator = Validator::make($request->all(), [
            'file0'      =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors(), 400);
        }
        
        if ($image) {
            $image_name = time().$image->getClientOriginalName();
            Storage::disk('usuarios')->put($image_name, \File::get($image));

            return $this->sendResponse(true, 'Imagen subida', $image_name, 200);
        }
        
        return $this->sendResponse(false, 'Error al subir imagen', null, 400);
    }

    public function getImage($filename){
        $isset = Storage::disk('usuarios')->exists($filename);
        if ($isset) {
            $file = Storage::disk('usuarios')->get($filename);
            return new Response($file);
        }
        
        return $this->sendResponse(false, 'La imagen no existe', null, 404);
    }
}
