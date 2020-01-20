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
    public function index()
    {
        $sucursales = Sucursal::orderBy('created_at','desc')->get()->load('empresa');
        return $this->sendResponse($sucursales, '');
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
        $json = $request->input('json', null);
        $input = json_decode($json, true);

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
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $sucursal = new Sucursal();
        $sucursal->id_empresa = $input['id_empresa'];
        $sucursal->codigo = $input['codigo'];
        $sucursal->nombre = $input['nombre'];
        $sucursal->telefono = $input['telefono'];
        $sucursal->id_pais = $input['id_pais'];
        $sucursal->id_ciudad = $input['id_ciudad'];
        $sucursal->direccion = $input['direccion'];
        $sucursal->ecommerce = $input['ecommerce'];
        $sucursal->save();

        return $this->sendResponse($sucursal, 'Sucursal registrada');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $puntoEmision = PuntoEmision::find($id);

        if (is_object($puntoEmision)) {
            return $this->sendResponse($puntoEmision, '');
        }else{
            return $this->sendError('Sucursal no definida', null);
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
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $puntoEmision = PuntoEmision::where('identificador', $id)->update($input);
        return $this->sendResponse($input, 'Sucursal actualizada');
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
