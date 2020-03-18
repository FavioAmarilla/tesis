<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\PuntoEmision;

class PuntoEmisionController extends BaseController
{
       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = PuntoEmision::with(['sucursal']);

        $id_sucursal = $request->query('id_sucursal');
        if ($id_sucursal) {
            $query->where('id_sucursal', '=', $id_sucursal);
        }

        $nombre = $request->query('nombre');
        if ($nombre) {
            $query->where('nombre', 'LIKE', '%'.$nombre.'%');
        }

        $codigo = $request->query('codigo');
        if ($codigo) {
            $query->where('codigo', 'LIKE', '%'.$codigo.'%');
        }

        $vr_tipo = $request->query('vr_tipo');
        if ($vr_tipo) {
            $query->where('vr_tipo', 'LIKE', '%'.$vr_tipo.'%');
        }

        $paginar = $request->query('paginar');
        if ($paginar) {
            $query->paginate(5);
        }

        $emision = $query->orderBy('vr_tipo','asc')->orderBy('codigo','asc')
        ->orderBy('nombre', 'asc')->get();
        
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $emision);
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
        $id_sucursal = $request->input("id_sucursal");
        $nombre = $request->input("nombre");
        $codigo = $request->input("codigo");
        $vr_tipo = $request->input("vr_tipo");

        $validator = Validator::make($request->all(), [
            'id_sucursal'  => 'required',
            'nombre'  => 'required',
            'codigo'  => 'required',
            'vr_tipo'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $emision = new PuntoEmision();
        $emision->id_sucursal = $id_sucursal;
        $emision->nombre = $nombre;
        $emision->codigo = $codigo;
        $emision->vr_tipo = $vr_tipo;

        if ($emision->save()) {
            return $this->sendResponse(true, 'Punto de Emision registrado', $emision);
        }else{
            return $this->sendResponse(false, 'Punto de Emision no registrado', null);
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
        $emision = PuntoEmision::find($id);

        if (is_object($emision)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $emision);
        }else{
            return $this->sendResponse(false, 'No se encontro el Punto de Emision', null);
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
        $id_sucursal = $request->input("id_sucursal");
        $nombre = $request->input("nombre");
        $codigo = $request->input("codigo");
        $vr_tipo = $request->input("vr_tipo");

        $validator = Validator::make($request->all(), [
            'id_sucursal'  => 'required',
            'nombre'  => 'required',
            'codigo'  => 'required',
            'vr_tipo'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $emision = PuntoEmision::find($id);
        if ($ciudad) {
            $emision->id_sucursal = $id_sucursal;
            $emision->nombre = $nombre;
            $emision->codigo = $codigo;
            $emision->vr_tipo = $vr_tipo;

            if ($emision->save()) {
                return $this->sendResponse(true, 'Punto de Emision actualizado', $emision);
            }else{
                return $this->sendResponse(false, 'Punto de Emision no actualizado', null);
            }
        }else{
            return $this->sendResponse(false, 'No se encontro el Punto de Emision', null);
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
