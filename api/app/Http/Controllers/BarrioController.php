<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Barrio;

class BarrioController extends BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Barrio::with(['ciudad']);

        $id_ciudad = $request->query('id_ciudad');
        if ($id_ciudad) {
            $query->where('id_ciudad', '=', $id_ciudad);
        }

        $nombre = $request->query('nombre');
        if ($nombre) {
            $query->where('nombre', 'LIKE', '%'.$nombre.'%');
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
        $id_ciudad = $request->input("id_ciudad");
        $nombre = $request->input("nombre");

        $validator = Validator::make($request->all(), [
            'id_ciudad'  => 'required',
            'nombre'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $barrio = new Barrio();
        $barrio->id_ciudad = $id_ciudad;
        $barrio->nombre = $nombre;

        if ($barrio->save()) {
            return $this->sendResponse(true, 'Barrio registrado', $barrio);
        }else{
            return $this->sendResponse(false, 'Barrio no registrado', null);
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
        $barrio = Barrio::find($id);

        if (is_object($barrio)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $barrio);
        }else{
            return $this->sendResponse(false, 'No se encontro el Barrio', null);
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
        $id_ciudad = $request->input("id_ciudad");
        $nombre = $request->input("nombre");

        $validator = Validator::make($request->all(), [
            'id_ciudad'  => 'required',
            'nombre'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $barrio = Barrio::find($id);
        if ($barrio) {
            $barrio->id_ciudad = $id_ciudad;
            $barrio->nombre = $nombre;
            if ($barrio->save()) {
                return $this->sendResponse(true, 'Barrio actualizado', $barrio);
            }else{
                return $this->sendResponse(false, 'Barrio no actualizado', null);
            }
        }else{
            return $this->sendResponse(false, 'No se encontro el Barrio', null);
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
