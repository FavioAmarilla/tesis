<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Timbrado;
use App\AsignacionComprobante;
use App\PuntoEmision;

class TimbradoController extends BaseController
{
       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Timbrado::orderBy('fecha_desde', 'desc');

        $numero = $request->query('numero');
        if ($numero) {
            $query->where('numero', 'LIKE', '%'.$numero.'%');
        }

        $numero_desde = $request->query('numero_desde');
        if ($numero_desde) {
            $query->where('numero_desde', 'LIKE', '%'.$numero_desde.'%');
        }

        $numero_hasta = $request->query('numero_hasta');
        if ($numero_hasta) {
            $query->where('numero_hasta', 'LIKE', '%'.$numero_hasta.'%');
        }

        $fecha_desde = $request->query('fecha_desde');
        if ($fecha_desde) {
            $query->where('fecha_desde', '=', $fecha_desde);
        }

        $fecha_hasta = $request->query('fecha_hasta');
        if ($fecha_hasta) {
            $query->where('fecha_hasta', '=', $fecha_hasta);
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

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
        $numero = $request->input("numero");
        $numero_desde = $request->input("numero_desde");
        $numero_hasta = $request->input("numero_hasta");
        $fecha_desde = $request->input("fecha_desde");
        $fecha_hasta = $request->input("fecha_hasta");

        $validator = Validator::make($request->all(), [
            'numero'  => 'required',
            'numero_desde'  => 'required',
            'numero_hasta'  => 'required',
            'fecha_desde'  => 'required',
            'fecha_hasta'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $timbrado = new Timbrado();
        $timbrado->numero = $numero;
        $timbrado->numero_desde = $numero_desde;
        $timbrado->numero_hasta = $numero_hasta;
        $timbrado->fecha_desde = $fecha_desde;
        $timbrado->fecha_hasta = $fecha_hasta;

        if ($timbrado->save()) {
            //obtener todos los puntos de emision
            $puntosEmision = PuntoEmision::orderBy('identificador', 'asc')->get();
            foreach($puntosEmision as $puntoEm){
                
                //se aguarda la asignacion de comprobante
                $asignacion = new AsignacionComprobante();
                $asignacion->id_timbrado = $timbrado->identificador;
                $asignacion->id_punto_emision = $puntoEm->identificador;
                $asignacion->ult_usado = 0;
                if (!$asignacion->save()) {
                    return $this->sendResponse(false, 'Error al registrar asignacion de comprobante', null, 400);
                }
            } 
            

            return $this->sendResponse(true, 'Timbrado registrado', $timbrado, 200);
        }
        
        return $this->sendResponse(false, 'Timbrado no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $pais = Timbrado::find($id);

        if (is_object($pais)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $pais, 200);
        }

        return $this->sendResponse(false, 'No se encontro el Timbrado', null, 404);
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
        $numero = $request->input("numero");
        $numero_desde = $request->input("numero_desde");
        $numero_hasta = $request->input("numero_hasta");
        $fecha_desde = $request->input("fecha_desde");
        $fecha_hasta = $request->input("fecha_hasta");

        $validator = Validator::make($request->all(), [
            'numero'  => 'required',
            'numero_desde'  => 'required',
            'numero_hasta'  => 'required',
            'fecha_desde'  => 'required',
            'fecha_hasta'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $timbrado = Timbrado::find($id);
        if ($timbrado) {
            $timbrado->numero = $numero;
            $timbrado->numero_desde = $numero_desde;
            $timbrado->numero_hasta = $numero_hasta;
            $timbrado->fecha_desde = $fecha_desde;
            $timbrado->fecha_hasta = $fecha_hasta;
            
            //validar si ya tiene asignaciones de comprobantes
            //en caso de no tener se crean
            $asignacion = AsignacionComprobante::where('id_timbrado', '=', $id)->exists();
            if (!$asignacion) {

                //obtener todos los puntos de emision
                $puntosEmision = PuntoEmision::orderBy('identificador', 'asc')->get();
                foreach($puntosEmision as $puntoEm){
                    
                    //se aguarda la asignacion de comprobante
                    $asignacion = new AsignacionComprobante();
                    $asignacion->id_timbrado = $id;
                    $asignacion->id_punto_emision = $puntoEm->identificador;
                    $asignacion->ult_usado = 0;
                    if (!$asignacion->save()) {
                        return $this->sendResponse(false, 'Error al registrar asignacion de comprobante', null, 400);
                    }
                } 
            }


            if ($timbrado->save()) {
                return $this->sendResponse(true, 'Timbrado actualizado', $timbrado, 200);
            }
            
            return $this->sendResponse(false, 'Timbrado no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro el Timbrado', null, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
    }
}
