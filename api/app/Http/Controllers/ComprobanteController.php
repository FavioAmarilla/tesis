<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Comprobante;
use App\ComprobanteItems;
use App\Pedido;
use App\PedidoItems;
use App\Timbrado;
use App\PuntoEmision;
use App\User;
use App\AsignacionComprobante;
use App\Sucursal;


class ComprobanteController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $query = Pais::orderBy('created_at', 'desc');

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
        $date = date('Y-m-d');
        $id_pedido = $request->input("id_pedido");

        $validator = Validator::make($request->all(), [
            'id_pedido'  => 'required'
        ]);
        if ($validator->fails()) return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        
        //obtener pedido
        $pedido = Pedido::with(['detalles.producto.tipoImpuesto', 'sucursal'])->find($id_pedido);
        if (!$pedido) return $this->sendResponse(false, 'No se encontro el Pedido', null, 404);
        if (!$pedido->sucursal) return $this->sendResponse(false, 'No se encontro la sucursal', null, 404);

        //obtener timbrado actual activo
        $timbrado = Timbrado::where([['fecha_desde', '<=', $date], ['fecha_hasta', '>=', $date]])->first();
        if (!$timbrado) return $this->sendResponse(false, 'No se encontro timbrado valido', null, 404);
        
        //obtener punto de emision
        $punto_emision = PuntoEmision::where([['vr_tipo', '=', 'ON'], ['id_sucursal', '=', $pedido->sucursal->identificador]])->first();
        if (!$punto_emision) return $this->sendResponse(false, 'No se encontro punto de emision para la sucursal', null, 404);

        //obtener cliente
        $usuario = User::with(['cliente'])->find($pedido->id_usuario);
        if (!$usuario) return $this->sendResponse(false, 'No se encontro el usuario', null, 404);
        if (!$usuario->cliente) return $this->sendResponse(false, 'No se encontro el cliente para el usuario', null, 404);

        //obtener asignacion de comprobante
        $asignacion_comp = AsignacionComprobante::where([['id_timbrado', '=', $timbrado->identificador], ['id_punto_emision', '=', $punto_emision->identificador]])->first();
        if (!$asignacion_comp) return $this->sendResponse(false, 'No se encontro asignacion de comprobante para el punto de emision', null, 404);

        //generar numero de comprobante
        $ult_usado = ($asignacion_comp->ult_usado == 0) ? 1 : $asignacion_comp->ult_usado + 1 ;
        $lengh_ult_usado = strlen(strval($ult_usado));
        $ceros = '';
        for ($i=0; $i < intval(7 - $lengh_ult_usado); $i++) { 
            $ceros .= '0';
        }
        $numero = $pedido->sucursal->codigo.'-'.$punto_emision->codigo.'-'.$ceros.$ult_usado;

        //se guarda el comprobante
        $comprobante = new Comprobante();
        $comprobante->id_pedido = $pedido->identificador;
        $comprobante->id_sucursal = $pedido->sucursal->identificador;
        $comprobante->id_timbrado = $timbrado->identificador;
        $comprobante->id_punto_emision= $punto_emision->identificador; 
        $comprobante->id_cliente = $usuario->cliente->identificador;
        $comprobante->numero = $numero;
        $comprobante->numero_ticket = $ult_usado;
        $comprobante->monto_total = $pedido->total;
        $comprobante->monto_exento = $pedido->total_exento;
        $comprobante->monto_iva5 = $pedido->total_iva5;
        $comprobante->monto_iva10 = $pedido->total_iva10;
        $comprobante->descuento= 0;

        if (!$comprobante->save()) return $this->sendResponse(false, 'Comprobante no registrado', $comprobante, 400);
        
        
        //se guardan los items
        foreach($pedido->detalles as $item){
                    
            $comprobanteItems = new ComprobanteItems();
            $comprobanteItems->id_comprobante = $comprobante->identificador;
            $comprobanteItems->id_producto = $item->id_producto;
            $comprobanteItems->precio_venta = $item->precio_venta;
            $comprobanteItems->costo_unitario = 0;
            $comprobanteItems->porc_impuesto = $item->producto->tipo_impuesto;
            $comprobanteItems->total = $item->cantidad * $item->precio_venta;
            $comprobanteItems->cantidad = $item->cantidad;
            $comprobanteItems->total_exento = $item->importe_exento;
            $comprobanteItems->total_iva5 = $item->importe_iva5;
            $comprobanteItems->total_iva10 = $item->importe_iva10;

            if (!$comprobanteItems->save()) return $this->sendResponse(false, 'Error al registrar item de comprobante', null, 400);
        } 

        //actualizar el ultimo numero usado
        $asignacion_comp = AsignacionComprobante::where([['id_timbrado', '=', $timbrado->identificador], ['id_punto_emision', '=', $punto_emision->identificador]])->first();
        if (!$asignacion_comp) return $this->sendResponse(false, 'No se encontro asignacion de comprobante para el punto de emision', null, 404);  
        $asignacion_comp->ult_usado = $ult_usado;
        if (!$asignacion_comp->save()) return $this->sendResponse(false, 'Ultimo numero usado no actualizado', $asignacion_comp, 400);
        
        
        return $this->sendResponse(true, 'Comprobante registrado', $comprobante, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
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
