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
        $query = Sucursal::with(['empresa']);

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

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->orderBy('id_ciudad', 'asc')->orderBy('nombre', 'asc')->$listar();
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data);
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

        $validator = Validator::make($input, [
            'id_empresa'  => 'required',
            'codigo'      => 'required', 
            'nombre'      => 'required', 
            'telefono'    => 'required',
            'id_pais'     => 'required',
            'id_ciudad'   => 'required',
            'direccion'   => 'required',
            'ecommerce'   => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
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

        if ($sucursal->save()) {
            return $this->sendResponse(true, 'Sucursal registrada', $sucursal);
        }else{
            return $this->sendResponse(false, 'Sucursal no registrada', null);
        }
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
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $sucursal);
        }else{
            return $this->sendResponse(false, 'No se encontro la Sucursal', null);
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
        $id_empresa = $request->input("id_empresa");
        $codigo = $request->input("codigo");
        $nombre = $request->input("nombre");
        $telefono = $request->input("telefono");
        $id_pais = $request->input("id_pais");
        $id_ciudad = $request->input("id_ciudad");
        $direccion = $request->input("direccion");
        $ecommerce = $request->input("ecommerce");

        $validator = Validator::make($input, [
            'id_empresa'  => 'required',
            'codigo'      => 'required', 
            'nombre'      => 'required', 
            'telefono'    => 'required',
            'id_pais'     => 'required',
            'id_ciudad'   => 'required',
            'direccion'   => 'required',
            'ecommerce'   => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $sucursal = Sucursal::find($id);
        if ($barrio) {
            $sucursal->id_empresa = $id_empresa;
            $sucursal->codigo = $codigo;
            $sucursal->nombre = $nombre;
            $sucursal->telefono = $telefono;
            $sucursal->id_pais = $id_pais;
            $sucursal->id_ciudad = $id_ciudad;
            $sucursal->direccion = $direccion;
            $sucursal->ecommerce = $ecommerce;
            if ($sucursal->save()) {
                return $this->sendResponse(true, 'Sucursal actualizada', $sucursal);
            }else{
                return $this->sendResponse(false, 'Sucursal no actualizada', null);
            }
        }else{
            return $this->sendResponse(false, 'No se encontro la Sucursal', null);
        }
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
}
