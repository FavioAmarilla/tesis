<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Marca;

class MarcaController extends BaseController
{
       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Marca::with(['productos']);

        $nombre = $request->query('nombre');
        if ($nombre) {
            $query->where('nombre', 'LIKE', '%'.$nombre.'%');
        }

        $paginar = $request->query('paginar');
        $listar = (filter_var($paginar, FILTER_VALIDATE_BOOLEAN)) ? 'paginate' : 'get';

        $data = $query->orderBy('nombre', 'asc')->$listar();
        
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
        $nombre = $request->input("nombre");

        $validator = Validator::make($request->all(), [
            'nombre'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $marca = new Marca();
        $marca->nombre = $nombre;
        $marca->slug = Str::slug($nombre, '-');

        if ($marca->save()) {
            return $this->sendResponse(true, 'Marca registrada', null, 201);
        }
        
        return $this->sendResponse(false, 'Marca no registrada', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $marca = Marca::find($id);

        if (is_object($marca)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $marca, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro la Marca', null, 404);
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
        $nombre = $request->input("nombre");

        $validator = Validator::make($request->all(), [
            'nombre'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $marca = Marca::find($id);
        if ($marca) {
            $marca->nombre = $nombre;
            $marca->slug = Str::slug($nombre, '-');

            if ($marca->save()) {
                return $this->sendResponse(true, 'Marca actualizada', null, 200);
            }
            
            return $this->sendResponse(false, 'Barrio no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro la Marca', null, 404);
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
