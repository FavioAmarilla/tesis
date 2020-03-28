<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\CuponDescuento;

class CuponDescuentoController extends BaseController
{
       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = CuponDescuento::orderBy('fecha_hasta', 'desc');

        $descripcion = $request->query('descripcion');
        if ($descripcion) {
            $query->where('descripcion', 'LIKE', '%'.$descripcion.'%');
        }
        
        $codigo = $request->query('codigo');
        if ($codigo) {
            $query->where('codigo', '=', $codigo);
        }

        $porc_descuento = $request->query('porc_descuento');
        if ($porc_descuento) {
            $query->where('porc_descuento', '=', $porc_descuento);
        }

        $fecha_desde = $request->query('fecha_desde');
        if ($fecha_desde) {
            $query->where('fecha_desde', '=', $fecha_desde);
        }

        $fecha_hasta = $request->query('fecha_hasta');
        if ($fecha_hasta) {
            $query->where('fecha_hasta', '=', $fecha_hasta);
        }

        $usado = $request->query('usado');
        if ($usado) {
            $query->where('usado', '=', $usado);
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
        $descripcion = $request->input("descripcion");
        $porc_descuento = $request->input("porc_descuento");
        $codigo = $request->input("codigo");
        $fecha_desde = $request->input("fecha_desde");
        $fecha_hasta = $request->input("fecha_hasta");

        $validator = Validator::make($request->all(), [
            'descripcion'=> 'required',
            'porc_descuento'=> 'required',
            'codigo'=> 'required',
            'fecha_desde'=> 'required',
            'fecha_hasta'=> 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $cupon = new CuponDescuento();
        $cupon->descripcion = $descripcion;
        $cupon->porc_descuento = $porc_descuento;
        $cupon->codigo = $codigo;
        $cupon->fecha_desde = $fecha_desde;
        $cupon->fecha_hasta = $fecha_hasta;

        if ($cupon->save()) {
            return $this->sendResponse(true, 'Cupon de Descuento registrado', $cupon, 201);
        }
        
        return $this->sendResponse(false, 'Cupon de Descuento no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $pais = Pais::find($id);

        if (is_object($pais)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $pais, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Cupon de Descuento', null, 404);
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
            'descripcion'=> 'required',
            'porc_descuento'=> 'required',
            'codigo'=> 'required',
            'fecha_desde'=> 'required',
            'fecha_hasta'=> 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $cupon = new CuponDescuento();
        if ($pais) {
            $cupon->descripcion = $descripcion;
            $cupon->porc_descuento = $porc_descuento;
            $cupon->codigo = $codigo;
            $cupon->fecha_desde = $fecha_desde;
            $cupon->fecha_hasta = $fecha_hasta;

            if ($pais->save()) {
                return $this->sendResponse(true, 'Cupon de Descuento actualizado', $cupon, 200);
            }
            
            return $this->sendResponse(false, 'Cupon de Descuento no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro el Cupon de Descuento', null, 404);
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
