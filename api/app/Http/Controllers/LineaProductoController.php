<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\LineaProducto;

class LineaProductoController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $lineas = LineaProducto::orderBy('created_at','desc')->get();
        return $this->sendResponse($lineas, '');
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
            'descripcion'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $linea = new LineaProducto();
        $linea->descripcion = $input['descripcion'];
        $linea->save();

        return $this->sendResponse($linea, 'Linea de producto registrada');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $linea = LineaProducto::find($id);

        if (is_object($linea)) {
            return $this->sendResponse($linea, '');
        }else{
            return $this->sendError('Linea de producto no definida', null);
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
            'descripcion'   => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $linea = LineaProducto::where('identificador', $id)->update($input);
        return $this->sendResponse($input, 'Linea de producto actualizada');
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
