<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\EcParametros;
use App\EcParamCiudades;

class EcParametrosController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = EcParametros::with(['pais']);

        $monto_minimo = $request->query('monto_minimo');
        if ($monto_minimo) {
            $query->where('monto_minimo', '=', $monto_minimo);
        }

        $costo_delivery = $request->query('costo_delivery');
        if ($costo_delivery) {
            $query->where('costo_delivery', '=', $costo_delivery);
        }

        $id_pais = $request->query('id_pais');
        if ($id_pais) {
            $query->where('id_pais', '=', $id_pais);
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'first';

        $data = $query->orderBy('identificador', 'asc')->$listar();
        
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
        $monto_minimo = $request->input("monto_minimo");
        $costo_delivery = $request->input("costo_delivery");
        $id_pais = $request->input("id_pais");
        $ciudades = json_decode($request->input("ciudades"), true);

        $validator = Validator::make($request->all(), [
            'monto_minimo'  => 'required',
            'costo_delivery'  => 'required',
            'id_pais'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $parametro = new EcParametros();
        $parametro->monto_minimo = $monto_minimo;
        $parametro->costo_delivery = $costo_delivery;
        $parametro->id_pais = $id_pais;

        //validar que los datos de ciudades habilitadas llegaron
        if (count($ciudades) <= 0) {
            return $this->sendResponse(false, 'Debe agregar por lo menos una ciudad', null);
        }

        if ($parametro->save()) {
            for ($i=0; $i <= count($ciudades) - 1 ; $i++) {
                $paramCiudades = new EcParamCiudades();
                $paramCiudades->id_ec_parametro = $parametro->identificador;
                $paramCiudades->id_ciudad = $ciudades[$i];
                $paramCiudades->activo = 'S';
                if (!$paramCiudades->save()) {
                    return $this->sendResponse(true, 'Ciudades de parametro registrados', $paramCiudades);
                    break;
                }
            }

            return $this->sendResponse(true, 'Parametros registrados', $parametro);
        }else{
            return $this->sendResponse(false, 'Parametros no registrados', null);
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
        $parametro = EcParametros::find($id);

        if (is_object($parametro)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $parametro);
        }else{
            return $this->sendResponse(false, 'No se encontro el Parametro', null);
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
        $monto_minimo = $request->input("monto_minimo");
        $costo_delivery = $request->input("costo_delivery");
        $id_pais = $request->input("id_pais");
        $ciudades = json_decode($request->input("ciudades"), true);

        $validator = Validator::make($request->all(), [
            'monto_minimo'  => 'required',
            'costo_delivery'  => 'required',
            'id_pais'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

         //validar que los datos de ciudades habilitadas llegaron
         if (count($ciudades) <= 0) {
            return $this->sendResponse(false, 'Debe agregar por lo menos una ciudad', null);
        }

        $parametro = EcParametros::find($id);
        if ($parametro) {
            $parametro->monto_minimo = $monto_minimo;
            $parametro->costo_delivery = $costo_delivery;
            $parametro->id_pais = $id_pais;

            if ($parametro->save()) {
                $paramCiudades = EcParamCiudades::where('id_ec_parametro', $id)->delete();
                for ($i=0; $i <= count($ciudades) - 1 ; $i++) {
                    $paramCiudades = new EcParamCiudades();
                    $paramCiudades->id_ec_parametro = $parametro->identificador;
                    $paramCiudades->id_ciudad = $ciudades[$i];
                    $paramCiudades->activo = 'S';
                    if (!$paramCiudades->save()) {
                        return $this->sendResponse(true, 'Ciudades de parametro no actualizados', $paramCiudades);
                        break;
                    }
                }

                
                return $this->sendResponse(true, 'Parametro actualizado', $parametro);
            }else{
                return $this->sendResponse(false, 'Parametro no actualizado', null);
            }
        }else{
            return $this->sendResponse(false, 'No se encontro el Parametro', null);
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
