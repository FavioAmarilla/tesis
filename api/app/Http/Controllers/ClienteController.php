<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Cliente;

class ClienteController extends BaseController
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Cliente::with(['usuario']);

        $id_usuario = $request->query('id_usuario');
        if ($id_usuario) {
            $query->where('id_usuario', '=', $id_usuario);
        }

        $razon_social = $request->query('razon_social');
        if ($razon_social) {
            $query->where('razon_social', 'LIKE', '%'.$razon_social.'%');
        }

        $numero_documento = $request->query('numero_documento');
        if ($numero_documento) {
            $query->where('numero_documento', 'LIKE', '%'.$numero_documento.'%');
        }

        $celular = $request->query('celular');
        if ($celular) {
            $query->where('celular', 'LIKE', '%'.$celular.'%');
        }

        $telefono = $request->query('telefono');
        if ($telefono) {
            $query->where('telefono', 'LIKE', '%'.$telefono.'%');
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';
        
        $data = $query->orderBy('created_at', 'desc')->$listar();
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
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
        $id_usuario = $request->input("id_usuario");
        $razon_social = $request->input("razon_social");
        $numero_documento = $request->input("numero_documento");
        $celular = $request->input("celular");
        $telefono = $request->input("telefono");


        $validator = Validator::make($request->all(), [
            'id_usuario'  => 'required',
            'razon_social'  => 'required',
            'numero_documento'  => 'required',
            'celular'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $cliente = new Cliente();
        $cliente->id_usuario = $id_usuario;
        $cliente->razon_social = $razon_social;
        $cliente->numero_documento = $numero_documento;
        $cliente->celular = $celular;
        $cliente->telefono = $telefono;

        if ($cliente->save()) {
            return $this->sendResponse(true, 'Cliente registrado', $cliente, 201);
        }
        
        return $this->sendResponse(false, 'Cliente no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $cliente = Cliente::find($id)->load('usuario');

        if (is_object($cliente)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $cliente, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Parametro', null, 404);
    }

    public function showByUsuario($id)
    {
        $cliente = Cliente::with(['usuario'])->where('id_usuario', '=', $id)->first();

        if (is_object($cliente)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $cliente, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Cliente', null, 404);
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
        $id_usuario = $request->input("id_usuario");
        $razon_social = $request->input("razon_social");
        $numero_documento = $request->input("numero_documento");
        $celular = $request->input("celular");
        $telefono = $request->input("telefono");

        $validator = Validator::make($request->all(), [
            'id_usuario'  => 'required',
            'razon_social'  => 'required',
            'numero_documento'  => 'required',
            'celular'  => 'required'
        ]);


        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 200);
        }

        $cliente = Cliente::find($id);
        if ($cliente) {
            $cliente->id_usuario = $id_usuario;
            $cliente->razon_social = $razon_social;
            $cliente->numero_documento = $numero_documento;
            $cliente->celular = $celular;
            $cliente->telefono = $telefono;
    
            if ($cliente->save()) {
                return $this->sendResponse(true, 'Cliente actualizado', null, 200);
            }

            return $this->sendResponse(false, 'Cliente no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro el Cliente', null, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
    }
}
