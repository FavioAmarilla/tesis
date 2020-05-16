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
        $marcador = $request->input('marcador');
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
            $ciudadCoord = new CiudadCoord();
            $ciudadCoord->id_ciudad = $id;

            if (count($poligono) > 0) {
                $coordenadas = [];
                foreach ($poligono as $value) {
                    array_push($coordenadas, new Point($value[1], $value[0]));
                }
                $ciudadCoord->poligono = new Polygon([new LineString($coordenadas)]);
            } else $ciudadCoord->poligono = null;

            if ($marcador) $ciudadCoord->marcador = new Point($marcador['lat'], $marcador['lng']);
            else $ciudadCoord->marcador = null;

            if ($ciudadCoord->save()) return $this->sendResponse(true, 'Ciudad registrada', $ciudad, 201);
            
            return $this->sendResponse(false, 'Ha ocurrido un problema', $ciudad, 400);
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
        $ciudad = Ciudad::with(['pais', 'coordenadas'])->find($id);

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
        $marcador = $request->input('marcador');
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
                
                $ciudadCoord = CiudadCoord::where('id_ciudad', '=', $id)->first();
                if (!$ciudadCoord) $ciudadCoord = new CiudadCoord();
                
                $ciudadCoord->id_ciudad = $id;

                if (count($poligono) > 0) {
                    $coordenadas = [];
                    foreach ($poligono as $value) {
                        array_push($coordenadas, new Point($value[1], $value[0]));
                    }
                    $ciudadCoord->poligono = new Polygon([new LineString($coordenadas)]);
                } else $ciudadCoord->poligono = null;

                if ($marcador) $ciudadCoord->marcador = new Point($marcador['lat'], $marcador['lng']);
                else $ciudadCoord->marcador = null;

                if ($ciudadCoord->save()) return $this->sendResponse(true, 'Ciudad actualizada', $ciudad, 200);
                
                return $this->sendResponse(false, 'Ha ocurrido un problema', $ciudad, 400);
            }
            
            return $this->sendResponse(false, 'Ciudad no actualizada', null, 500);
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
        $ciudad = Ciudad::find($id);
        
        if ($ciudad) {
            $ciudad->activo = ($ciudad->activo == 'S') ? 'N' : 'S';

            if ($ciudad->save()) return $this->sendResponse(true, 'El estado de la ciudad ha sido actualizada correctamente', $ciudad, 200);

            return $this->sendResponse(false, 'Ha ocurrido un problema al intentar actualizar la ciudad', null, 500);
        }

        return $this->sendResponse(false, 'No se encontro la ciudad', null, 404);

    }

    /**
     * Verifica si la ubicación seleccionada está dentro de las coordenadas de la ciudad
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function verificarZona(Request $request, $id) {
        $coordenadas = $request->input('coordenadas');

        if ($coordenadas) {
            $coordenadas = new Point($coordenadas['lat'], $coordenadas['lng']);
    
            $resultados = CiudadCoord::contains('poligono', $coordenadas)->get();

            $permitido = false;
            foreach ($resultados as $resultado) {
                if ($resultado->id_ciudad == $id) {
                    $permitido = true;
                    break;
                }
            }
            
            if ($permitido) return $this->sendResponse(true, 'Ubicación dentro de la zona de repartos', null, 200);
    
            return $this->sendResponse(false, 'Ubicación fuera de la zona de repartos', null, 200);
        }

        return $this->sendResponse(false, 'Coordenadas invalidas', null, 404);
    }
}
