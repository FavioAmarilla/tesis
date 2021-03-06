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
    public function index(Request $request)
    {
        $query = TipoImpuesto::orderBy('valor', 'asc');

        $descripcion = $request->query('descripcion');
        if ($descripcion) {
            $query->where('descripcion', 'LIKE', '%'.$descripcion.'%');
        }

        $valor = $request->query('valor');
        if ($valor) {
            $query->where('valor', '=', $valor);
        }

        $paginar = $request->query('paginar');
        $listar = (filter_var($paginar, FILTER_VALIDATE_BOOLEAN)) ? 'paginate' : 'get';

        $data = $query->$listar();
        
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
        $descripcion = $request->input("descripcion");
        $valor = $request->input("valor");

        $validator = Validator::make($request->all(), [
            'descripcion'  => 'required',
            'valor'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $impuesto = new TipoImpuesto();
        $impuesto->descripcion = $descripcion;
        $impuesto->valor = $valor;

        if ($impuesto->save()) {
            return $this->sendResponse(true, 'Tipo de Impuesto registrado', $impuesto, 201);
        }
        
        return $this->sendResponse(false, 'Tipo de Impuesto no registrado', null, 400);
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
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $impuesto, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Tipo de Impuesto', null, 404);
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
        $descripcion = $request->input("descripcion");
        $valor = $request->input("valor");

        $validator = Validator::make($request->all(), [
            'descripcion'  => 'required',
            'valor'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $impuesto = TipoImpuesto::find($id);
        if ($pais) {
            $impuesto->descripcion = $descripcion;
            $impuesto->valor = $valor;

            if ($impuesto->save()) {
                return $this->sendResponse(true, 'Tipo de Impuesto actualizado', $impuesto, 200);
            }
            
            return $this->sendResponse(false, 'Tipo de Impuesto no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro la Pais', null, 404);
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
