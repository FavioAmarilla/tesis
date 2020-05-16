<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use App\Http\Controllers\BaseController as BaseController;
use App\Sucursal;

class SucursalController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Sucursal::with(['empresa', 'pais', 'ciudad']);

        $id_empresa = $request->query('id_empresa');
        if ($id_empresa) {
            $query->where('id_empresa', '=', $id_empresa);
        }

        $codigo = $request->query('codigo');
        if ($codigo) {
            $query->where('codigo', 'LIKE', '%'.$codigo.'%');
        }

        $nombre = $request->query('nombre');
        if ($nombre) {
            $query->where('nombre', 'LIKE', '%'.$nombre.'%');
        }

        $telefono = $request->query('telefono');
        if ($telefono) {
            $query->where('telefono', 'LIKE', '%'.$telefono.'%');
        }

        $id_pais = $request->query('id_pais');
        if ($id_pais) {
            $query->where('id_pais', '=', $id_pais);
        }

        $id_ciudad = $request->query('id_ciudad');
        if ($id_ciudad) {
            $query->where('id_ciudad', '=', $id_ciudad);
        }

        $direccion = $request->query('direccion');
        if ($direccion) {
            $query->where('direccion', 'LIKE', '%'.$direccion.'%');
        }

        $ecommerce = $request->query('ecommerce');
        if ($ecommerce) {
            $query->where('ecommerce', 'LIKE', '%'.$ecommerce.'%');
        }

        $central = $request->query('central');
        if ($central) {
            $query->where('central', 'LIKE', '%'.$central.'%');
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->orderBy('id_ciudad', 'asc')->orderBy('nombre', 'asc')->$listar();
        
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
        $id_empresa = $request->input("id_empresa");
        $codigo = $request->input("codigo");
        $nombre = $request->input("nombre");
        $telefono = $request->input("telefono");
        $id_pais = $request->input("id_pais");
        $id_ciudad = $request->input("id_ciudad");
        $direccion = $request->input("direccion");
        $ecommerce = $request->input("ecommerce");
        $central = $request->input("central");

        $validator = Validator::make($request->all(), [
            'id_empresa'  => 'required',
            'codigo'      => 'required', 
            'nombre'      => 'required', 
            'telefono'    => 'required',
            'id_pais'     => 'required',
            'id_ciudad'   => 'required',
            'direccion'   => 'required',
            'ecommerce'   => 'required',
            'central'     => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        if ($central == 'S') {
            Sucursal::where('central', '=', 'S')->update(['central' => 'N']);
        }

        $sucursal = new Sucursal();
        $sucursal->id_empresa = $id_empresa;
        $sucursal->codigo = $codigo;
        $sucursal->nombre = $nombre;
        $sucursal->telefono = $telefono;
        $sucursal->id_pais = $id_pais;
        $sucursal->id_ciudad = $id_ciudad;
        $sucursal->direccion = $direccion;
        $sucursal->ecommerce = $ecommerce;
        $sucursal->central = $central;

        if ($sucursal->save()) {
            return $this->sendResponse(true, 'Sucursal registrada', $sucursal, 201);
        }
        
        return $this->sendResponse(false, 'Sucursal no registrada', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $sucursal = Sucursal::find($id);

        if (is_object($sucursal)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $sucursal, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro la Sucursal', null, 404);
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
        $id_empresa = $request->input("id_empresa");
        $codigo = $request->input("codigo");
        $nombre = $request->input("nombre");
        $telefono = $request->input("telefono");
        $id_pais = $request->input("id_pais");
        $id_ciudad = $request->input("id_ciudad");
        $direccion = $request->input("direccion");
        $ecommerce = $request->input("ecommerce");
        $central = $request->input("central");

        $validator = Validator::make($request->all(), [
            'id_empresa'  => 'required',
            'codigo'      => 'required', 
            'nombre'      => 'required', 
            'telefono'    => 'required',
            'id_pais'     => 'required',
            'id_ciudad'   => 'required',
            'direccion'   => 'required',
            'ecommerce'   => 'required',
            'central'   => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        if ($central == 'S') {
            Sucursal::where('central', '=', 'S')->update(['central' => 'N']);
        }

        $sucursal = Sucursal::find($id);
        if ($sucursal) {
            $sucursal->id_empresa = $id_empresa;
            $sucursal->codigo = $codigo;
            $sucursal->nombre = $nombre;
            $sucursal->telefono = $telefono;
            $sucursal->id_pais = $id_pais;
            $sucursal->id_ciudad = $id_ciudad;
            $sucursal->direccion = $direccion;
            $sucursal->ecommerce = $ecommerce;
            $sucursal->central = $central;
            if ($sucursal->save()) {
                return $this->sendResponse(true, 'Sucursal actualizada', $sucursal, 200);
            }
            
            return $this->sendResponse(false, 'Sucursal no actualizada', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro la Sucursal', null, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $sucursal = Sucursal::find($id);
        
        if ($sucursal) {
            $sucursal->activo = ($sucursal->activo == 'S') ? 'N' : 'S';

            if ($sucursal->save()) return $this->sendResponse(true, 'El estado de la sucursal ha sido actualizado correctamente', $sucursal, 200);

            return $this->sendResponse(false, 'Ha ocurrido un problema al intentar actualizar la sucursal', null, 500);
        }

        return $this->sendResponse(false, 'No se encontro la sucursal', null, 404);
    }
}
