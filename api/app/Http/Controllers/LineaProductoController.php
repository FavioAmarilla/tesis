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
    public function index(Request $request)
    {
        $query = LineaProducto::orderBy('descripcion', 'asc');

        $descripcion = $request->query('descripcion');
        if ($descripcion) {
            $query->where('descripcion', 'LIKE', '%'.$descripcion.'%');
        }
        
        $slug = $request->query('slug');
        if ($slug) {
            $query->where('slug', '=', $slug);
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

        $validator = Validator::make($request->all(), [
            'descripcion'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(true, 'Error de validacion', $validator->errors(), 400);
        }

        $linea = new LineaProducto();
        $linea->descripcion = $descripcion;

        if ($linea->save()) {
            return $this->sendResponse(true, 'Linea de Producto registrada', $linea, 201);
        }
        
        return $this->sendResponse(false, 'Linea de Producto no registrada', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $empresa = LineaProducto::find($id);

        if (is_object($empresa)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $empresa, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro la Linea de Producto', null, 404);
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

        $validator = Validator::make($request->all(), [
            'descripcion'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors(), 400);
        }

        $linea = LineaProducto::find($id);
        if ($linea) {
            $linea->descripcion = $descripcion;

            if ($linea->save()) {
                return $this->sendResponse(true, 'Linea de Producto actualizada', $linea, 200);
            }
            
            return $this->sendResponse(false, 'Linea de Producto no actualizada', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro la Linea de Producto', null, 404);
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
