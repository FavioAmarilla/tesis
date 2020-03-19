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
        $query = LineaProducto::all();

        $descripcion = $request->query('descripcion');
        if ($descripcion) {
            $query->where('descripcion', 'LIKE', '%'.$descripcion.'%');
        }

        $paginar = $request->query('paginar');
        if ($paginar) {
            $data = $query->orderBy('descripcion','asc')->paginate(5);
        }else{
            $data = $query->orderBy('descripcion','asc')->get();
        }
        
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
        $descripcion = $request->input("descripcion");

        $validator = Validator::make($request->all(), [
            'descripcion'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(true, 'Error de validacion', $validator->errors());
        }

        $linea = new LineaProducto();
        $linea->descripcion = $descripcion;

        if ($linea->save()) {
            return $this->sendResponse(true, 'Linea de Producto registrada', $linea);
        }else{
            return $this->sendResponse(false, 'Linea de Producto no registrada', null);
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
        $empresa = LineaProducto::find($id);

        if (is_object($empresa)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $empresa);
        }else{
            return $this->sendResponse(false, 'No se encontro la Linea de Producto', null);
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
        $descripcion = $request->input("descripcion");

        $validator = Validator::make($request->all(), [
            'descripcion'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $linea = LineaProducto::find($id);
        if ($linea) {
            $linea->descripcion = $descripcion;

            if ($linea->save()) {
                return $this->sendResponse(true, 'Linea de Producto actualizada', $linea);
            }else{
                return $this->sendResponse(false, 'Linea de Producto no actualizada', null);
            }
        }else{
            return $this->sendResponse(false, 'No se encontro la Linea de Producto', null);
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
