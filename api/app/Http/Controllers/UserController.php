<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use App\Http\Controllers\BaseController as BaseController;
use App\User;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::orderBy('nombre_completo', 'desc')->get();

        return $this->sendResponse($users, '');
    }

    public function paginate()
    {
        $paginate = User::orderBy('nombre_completo', 'desc')->paginate(5);

        return $this->sendResponse($paginate, '');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $json = $request->input('json', null);
        $input = json_decode($json, true);

        $validator = Validator::make($input, [
            'nombre_completo'   =>  'required',
            'email'             =>  'required|email|unique:fnd_usuarios',
            'clave_acceso'      =>  'required',
            'imagen'            =>  'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $user = new User();
        $user->nombre_completo = $input['nombre_completo'];
        $user->email = $input['email'];
        $user->clave_acceso = hash('sha256', $input['clave_acceso']);
        $user->imagen = $input['imagen'];
        $user->save();

        return $this->sendResponse($user, 'Usuario registrado');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
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
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $json = $request->input('json', null);
        $input = json_decode($json, true);

        $validator = Validator::make($input, [
            'nombre_completo'   =>  'required',
            'email'             =>  'required',
            'clave_acceso'      =>  'required',
            'imagen'            =>  'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $input['clave_acceso'] = hash('sha256', $input['clave_acceso']);

        $user = User::where('identificador', $id)->update($input);
        return $this->sendResponse($input, 'Usuario actualizado');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }


    public function signIn(Request $request){
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


    public function upload(Request $request){
        $image = $request->file('file0');

        $validator = \Validator::make($request->all(), [
            'file0'      =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }else{
            if ($image) {
                $image_name = time().$image->getClientOriginalName();
                \Storage::disk('usuarios')->put($image_name, \File::get($image));
    
                return $this->sendResponse($image_name, 'Imagen subida');
            }else{
                return $this->sendError('Error al subir imagen', null);
            }    
        }
        return response()->json($data);
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
