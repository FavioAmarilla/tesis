<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Ciudad;
use App\CiudadCoord;

use Grimzy\LaravelMysqlSpatial\Types\Point;
use Grimzy\LaravelMysqlSpatial\Types\Polygon;
use Grimzy\LaravelMysqlSpatial\Types\LineString;

class CiudadController extends BaseController
{
       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Ciudad::with(['pais', 'coordenadas']);

        $identificador = $request->query('identificador');
        if ($identificador) {
            if (is_array($identificador)) $query->whereIn('identificador', $identificador);
            else $query->where('identificador', '=', $identificador);
        }
        
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
        $id_pais = $request->input("id_pais");
        $nombre = $request->input("nombre");
        $poligono = $request->input('poligono');

        $validator = Validator::make($request->all(), [
            'id_pais'  => 'required',
            'nombre'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $ciudad = new Ciudad();
        $ciudad->id_pais = $id_pais;
        $ciudad->nombre = $nombre;

        if ($ciudad->save()) {
            if (count($poligono) > 0) {
                $coordenadas = [];
                $ciudadCoord = new CiudadCoord();
                
                foreach ($poligono as $value) {
                    array_push($coordenadas, new Point($value[1], $value[0]));
                }
                $ciudadCoord->poligono = new Polygon([new LineString($coordenadas)]);
                $ciudadCoord->id_ciudad = $id;

                if ($ciudadCoord->save()) return $this->sendResponse(true, 'Ciudad registrada', $ciudad, 201);
                
                return $this->sendResponse(false, 'Ha ocurrido un problema', $ciudad, 400);
            }

            return $this->sendResponse(true, 'Ciudad registrada', null, 201);
        }
        
        return $this->sendResponse(false, 'Ciudad no registrada', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $ciudad = Ciudad::with(['coordenadas'])->find($id);

        if (is_object($ciudad)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $ciudad, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro la Ciudad', null, 404);
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
        $poligono = $request->input('poligono');

        $validator = Validator::make($request->all(), [
            'id_pais'  => 'required',
            'nombre'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $ciudad = Ciudad::find($id);
        if ($ciudad) {
            $ciudad->id_pais = $id_pais;
            $ciudad->nombre = $nombre;

            if ($ciudad->save()) {
                if (count($poligono) > 0) {
                    $coordenadas = [];
                    $ciudadCoord = CiudadCoord::where('id_ciudad', '=', $id)->first();
                    if (!$ciudadCoord) $ciudadCoord = new CiudadCoord();

                    foreach ($poligono as $value) {
                        array_push($coordenadas, new Point($value[1], $value[0]));
                    }
                    $ciudadCoord->poligono = new Polygon([new LineString($coordenadas)]);
                    $ciudadCoord->id_ciudad = $id;

                    if ($ciudadCoord->save()) return $this->sendResponse(true, 'Ciudad actualizada', $ciudad, 200);
                    
                    return $this->sendResponse(false, 'Ha ocurrido un problema', $ciudad, 400);
                } else {
                    $ciudadCoord = CiudadCoord::where('id_ciudad', '=', $id)->first();
                    if ($ciudadCoord) $ciudadCoord->delete();

                    return $this->sendResponse(false, 'Ciudad no actualizada', null, 200);
                }
            }
            
            return $this->sendResponse(false, 'Ciudad no actualizada', null, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro la Ciudad', null, 404);
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
