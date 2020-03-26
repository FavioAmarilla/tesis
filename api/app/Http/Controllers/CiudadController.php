<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Ciudad;

class CiudadController extends BaseController
{
       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Ciudad::with(['pais']);

        $identificador = $request->query('identificador');
        if ($identificador) {
            $query->whereIn('identificador', $identificador);
        }

        return $this->sendResponse(true, 'Listado obtenido exitosamente', $where);
        $id_pais = $request->query('id_pais');
        if ($id_pais) {
            $query->where('id_pais', '=', $id_pais);
        }

        $nombre = $request->query('nombre');
        if ($nombre) {
            $query->where('nombre', 'LIKE', '%'.$nombre.'%');
        }

        $activo = $request->query('activo');
        if ($activo) {
            $query->where('activo', '=', $activo);
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->orderBy('id_pais', 'asc')->orderBy('nombre', 'asc')->$listar();
        
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
        $id_pais = $request->input("id_pais");
        $nombre = $request->input("nombre");

        $validator = Validator::make($request->all(), [
            'id_pais'  => 'required',
            'nombre'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $ciudad = new Ciudad();
        $ciudad->id_pais = $id_pais;
        $ciudad->nombre = $nombre;

        if ($ciudad->save()) {
            return $this->sendResponse(true, 'Ciudad registrada', $ciudad);
        }else{
            return $this->sendResponse(false, 'Ciudad no registrada', null);
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
        $ciudad = Ciudad::find($id);

        if (is_object($ciudad)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $ciudad);
        }else{
            return $this->sendResponse(false, 'No se encontro la Ciudad', null);
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
        $id_pais = $request->input("id_pais");
        $nombre = $request->input("nombre");

        $validator = Validator::make($request->all(), [
            'id_pais'  => 'required',
            'nombre'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $ciudad = Barrio::find($id);
        if ($ciudad) {
            $ciudad->id_pais = $id_pais;
            $ciudad->nombre = $nombre;
            if ($ciudad->save()) {
                return $this->sendResponse(true, 'Ciudad actualizada', $ciudad);
            }else{
                return $this->sendResponse(false, 'Ciudad no actualizada', null);
            }
        }else{
            return $this->sendResponse(false, 'No se encontro la Ciudad', null);
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
