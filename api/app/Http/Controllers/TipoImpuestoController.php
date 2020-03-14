<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\TipoImpuesto;

class TipoImpuestoController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $impuestos = TipoImpuesto::orderBy('valor','desc')->paginate(5);
        return $this->sendResponse($impuestos, '');
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
            'descripcion'     => 'required', 
            'valor'           => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $impuesto = new TipoImpuesto();
        $impuesto->descripcion = $input['descripcion'];
        $impuesto->valor = $input['valor'];
        $impuesto->save();

        return $this->sendResponse($impuesto, 'Tipo de impuesto registrado');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $impuesto = TipoImpuesto::find($id);

        if (is_object($impuesto)) {
            return $this->sendResponse($impuesto, '');
        }else{
            return $this->sendError('Tipo de impuesto no definido', null);
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
            'descripcion'   => 'required',
            'valor'   => 'required'
        ]);
            
        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $impuesto = TipoImpuesto::where('identificador', $id)->update($input);
        return $this->sendResponse($input, 'Tipo de impuesto actualizado');
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
