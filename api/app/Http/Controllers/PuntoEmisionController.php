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
    public function index()
    {
        $puntosEmision = PuntoEmision::orderBy('created_at','desc')->get();
        return $this->sendResponse($puntosEmision, '');
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
            'nombre'     => 'required', 
            'codigo'           => 'required',
            'vr_tipo'           => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $puntoEmision = new PuntoEmision();
        $puntoEmision->nombre = $input['nombre'];
        $puntoEmision->codigo = $input['codigo'];
        $puntoEmision->vr_tipo = $input['vr_tipo'];
        $puntoEmision->save();

        return $this->sendResponse($puntoEmision, 'Punto de emision registrado');
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
            return $this->sendError('Punto de emision no definido', null);
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
            'nombre'     => 'required', 
            'codigo'           => 'required',
            'vr_tipo'           => 'required',
        ]);
            
        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $puntoEmision = PuntoEmision::where('identificador', $id)->update($input);
        return $this->sendResponse($input, 'Punto de emision actualizado');
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
