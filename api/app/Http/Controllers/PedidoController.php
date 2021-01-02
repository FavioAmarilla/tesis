<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Http\Controllers\BancardController as BancardController;
use App\Http\Controllers\ComprobanteController as ComprobanteController;
use App\Comprobante;
use App\Pedido;
use App\PedidoItems;
use App\PedidoPagos;
use App\CuponDescuento;
use App\UserTarjetas;
use App\Empresa;
use App\User;
use App\Cliente;
use PDF;

class PedidoController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Pedido::with(['detalles', 'usuario.cliente', 'sucursal', 'cupon', 'pais', 'ciudad', 'barrio', 'pagos']);

        $identificador = $request->query('identificador');
        if ($identificador) {
            $query->where('identificador', '=', $identificador);
        }

        $id_usuario = $request->query('id_usuario');
        if ($id_usuario) {
            $query->where('id_usuario', '=', $id_usuario);
        }
        
        $id_sucursal = $request->query('id_sucursal');
        if ($id_sucursal) {
            $query->where('id_sucursal', '=', $id_sucursal);
        }
        
        $fecha = $request->query('fecha');
        if ($fecha) {
            $query->where('fecha', '=', $fecha);
        }
        
        $id_usuario = $request->query('id_usuario');
        if ($id_usuario) {
            $query->where('id_usuario', '=', $id_usuario);
        }
        
        $id_pais = $request->query('id_pais');
        if ($id_pais) {
            $query->where('id_pais', '=', $id_pais);
        }
        
        $id_ciudad = $request->query('id_ciudad');
        if ($id_ciudad) {
            $query->where('id_ciudad', '=', $id_ciudad);
        }
        
        $id_barrio = $request->query('id_barrio');
        if ($id_barrio) {
            $query->where('id_barrio', '=', $id_barrio);
        }

        $direccion = $request->query('direccion');
        if ($direccion) {
            $query->where('direccion', 'LIKE', '%'.$direccion.'%');
        }
        
        $persona = $request->query('persona');
        if ($persona) {
            $query->where('persona', '=', $persona);
        }

        $nro_documento = $request->query('nro_documento');
        if ($nro_documento) {
            $query->where('nro_documento', 'LIKE', '%'.$nro_documento.'%');
        }

        $tipo_envio = $request->query('tipo_envio');
        if ($tipo_envio) {
            $query->where('tipo_envio', '=', $tipo_envio);
        }

        $estado = $request->query('estado');
        if ($estado) {
            $query->where('estado', '=', $estado);
        }

        $paginar = $request->query('paginar');
        $listar = (filter_var($paginar, FILTER_VALIDATE_BOOLEAN)) ? 'paginate' : 'get';

        $data = $query->orderBy('created_at', 'desc')->$listar();
        
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
        $id_cupon_descuento = $request->input("id_cupon_descuento");
        $id_usuario = $request->input("id_usuario");
        $id_sucursal = $request->input("id_sucursal");
        $fecha = $request->input("fecha");
        $id_ciudad = $request->input("id_ciudad");
        $id_barrio = $request->input("id_barrio");
        $direccion = $request->input("direccion");
        $latitud = $request->input("latitud");
        $longitud = $request->input("longitud");
        $persona = $request->input("persona");
        $nro_documento = $request->input("nro_documento");
        $telefono = $request->input("telefono");
        $asignado = $request->input("asignado");
        $nombre_asignado = $request->input("nombre_asignado");
        $nro_documento_asignado = $request->input("nro_documento_asignado");
        $telefono_asignado = $request->input("telefono_asignado");
        $costo_envio = $request->input("costo_envio");
        $observacion = $request->input("observacion");
        $tipo_envio = $request->input("tipo_envio");
        $estado = $request->input("estado");
        $productos = $request->input("productos");
        $pago = $request->input("pago");
        $tarjeta = $request->input("card_id");
        
        $token = $request->token;
        $usuario = $token->usuario;

        $validator = Validator::make($request->all(), [
            'id_usuario'  => 'required',
            'id_sucursal'  => 'required',
            'fecha'  => 'required',
            'costo_envio'  => 'required',
            'tipo_envio'  => 'required',
            'estado'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        // obtener totales
        $total = 0;
        $total_exento = 0;
        $total_iva5 = 0;
        $total_iva10 = 0;
        foreach ($productos as $producto) {
            $total += $producto['precio_venta'] * $producto['cantidad'];
            switch ($producto['tipo_impuesto']['valor']) {
                case 0:
                    $total_exento += $producto['precio_venta'] * $producto['cantidad'];
                    break;
                case 5:
                    $total_iva5 += $producto['precio_venta'] * $producto['cantidad'];
                    break;
                case 10:
                    $total_iva10 += $producto['precio_venta'] * $producto['cantidad'];
                    break;
            }
        }
        $total += $costo_envio;
        $total_exento += $costo_envio;
        $total_iva5 += $costo_envio;
        $total_iva10 += $costo_envio;

        if ($id_cupon_descuento) {
            $descuento = CuponDescuento::where('identificador', '=', $id_cupon_descuento);
            if ($descuento) {
                $aux = $total * $descuento->porc_desc / 100;
                $total -= $aux;
            }
        }

        $pedido = new Pedido();
        $pedido->id_cupon_descuento = $id_cupon_descuento;
        $pedido->id_usuario = $id_usuario;
        $pedido->id_sucursal = $id_sucursal;
        $pedido->fecha = $fecha;
        $pedido->id_ciudad = $id_ciudad;
        $pedido->id_barrio = $id_barrio;
        $pedido->direccion = $direccion;
        $pedido->latitud = $latitud;
        $pedido->longitud = $longitud;
        $pedido->costo_envio = $costo_envio;
        $pedido->observacion = $observacion;
        
        $pedido->tipo_envio = $tipo_envio;
        $pedido->estado = $estado;
        $pedido->total = $total;
        $pedido->total_exento = $total_exento;
        $pedido->total_iva5 = $total_iva5;
        $pedido->total_iva10 = $total_iva10;

        if ($asignado == 'me') {
            $pedido->persona = $persona;
            $pedido->nro_documento = $nro_documento;
            $pedido->telefono = $telefono;
        } else {
            $pedido->persona = $nombre_asignado;
            $pedido->nro_documento = $nro_documento_asignado;
            $pedido->telefono = $telefono_asignado;
        }

        $cliente = Cliente::where('id_usuario', '=', $id_usuario)->first();
        $cliente->razon_social = $persona;
        $cliente->numero_documento = $nro_documento;
        $cliente->celular = $telefono;
        $cliente->save();

        //validar que llegaron productos
        if (count($productos) <= 0) {
            return $this->sendResponse(false, 'Debe agregar por lo menos un producto', 400);
        }
        
        // validar que llego los datos del pago
        if (!$pago) {
            return $this->sendResponse(false, 'Debe agregar los datos de pago', 400);
        }

        if ($pedido->save()) {
            $total = 0;

            foreach ($productos as $producto) {
                $item = new PedidoItems();
                $item->id_pedido = $pedido->identificador;
                $item->id_producto = $producto['identificador'];
                $item->precio_venta = $producto['precio_venta'];
                switch ($producto['tipo_impuesto']['valor']) {
                    case 0:
                        $item->importe_exento = $producto['precio_venta'];
                        break;
                    case 5:
                        $item->importe_iva5 = $producto['precio_venta'];
                        break;
                    case 10:
                        $item->importe_iva10 = $producto['precio_venta'];
                        break;
                    default:
                        $item->importe_exento = 1;
                        break;
                }
                $item->cantidad = $producto['cantidad'];
                $item->activo = 'S';
                $total += ($producto['precio_venta'] * $producto['cantidad']);

                if (!$item->save()) {
                    return $this->sendResponse(true, 'Producto de pedido no registrados', $item, 400);
                    break;
                }
            }

            $total += $costo_envio;
            $total_exento += $costo_envio;
            $total_iva5 += $costo_envio;
            $total_iva10 += $costo_envio;

            // actualizar total
            $totalPedido = Pedido::find($pedido->identificador);
            $totalPedido->total = $total;
            if (!$totalPedido->save()) {
                return $this->sendResponse(true, 'Total de pedido no actualizado', $item, 400);
            }

            if ($pago) {
                $pagoIt = PedidoPagos::where('id_pedido', '=', $pedido->identificador)->first();
                if (!$pagoIt) $pagoIt = new PedidoPagos();
                
                $pagoIt->id_pedido = $pedido->identificador;
                $pagoIt->vr_tipo = $pago['tipo'];
                $pagoIt->total = $total;
                $pagoIt->importe = (isset($pago['importe'])) ? $pago['importe'] : 0;
                $pagoIt->vuelto = (isset($pago['importe'])) ? $pago['importe'] - $total : 0;
                $pagoIt->referencia = ($pagoIt->referencia) ? $pagoIt->referencia : $this->obtenerUltimaReferenciaPago();

                if ($pagoIt->save()) {
                    switch ($pago['tipo']) {
                        case 'ATCD':

                            $tarjeta = new UserTarjetas();
                            $tarjeta->id_usuario = $usuario->identificador;

                            if ($tarjeta->save()) {
                                $request->request->add([
                                    'pedido'    => $pedido->identificador,
                                    'user_id'   => $usuario->identificador,
                                    'card_id'   => $tarjeta->identificador,
                                    'email'     => $usuario->email,
                                    'celular'   => $usuario->celular
                                ]);
    
                                $bancard = new BancardController();
                                return $bancard->newCard($request);
                            }

                            return $this->sendResponse(false, 'Ha ocurrido un problema al intentar registrar la tarjeta', null, 500);
                        case 'PWTK':

                            $request->request->add([
                                'pedido'    => $pedido->identificador,
                                'user_id' => $usuario->identificador,
                                'card_id' => $pago['card_id'],
                                'amount' => $total,
                                'shop_process_id' => $pagoIt->referencia
                            ]);

                            $bancard = new BancardController();
                            return $bancard->payWithToken($request);
                        case 'BZ':
                        case 'PO':
                            $request->request->add([
                                'amount' => $total,
                                'shop_process_id' => $pagoIt->referencia,
                                'telefono' => $telefono,
                                'zimple' => $pago['tipo'] == 'BZ' ? 'S' : 'N'
                            ]);

                            $bancard = new BancardController();
                            return $bancard->singleBuy($request);
                        default:
                            return $this->sendResponse(true, 'Pedido registrado correctamente', null, 200);
                    }

                    return $this->sendResponse(true, 'Pedido registrado correctamente', null, 200);
                }

                return $this->sendResponse(true, 'Pago de pedido no registrado', $pagoIt, 400);
            }

            return $this->sendResponse(true, 'Pedido registrado', $pedido, 201);
        }
        
        return $this->sendResponse(false, 'Pedido no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $pedido = Pedido::with(['detalles', 'sucursal', 'cupon', 'pais', 'ciudad', 'barrio', 'pagos'])->find($id);

        if (is_object($pedido)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $pedido, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Pedido', null, 404);
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
        $id_cupon_descuento = $request->input("id_cupon_descuento");
        $id_usuario = $request->input("id_usuario");
        $id_sucursal = $request->input("id_sucursal");
        $fecha = $request->input("fecha");
        $id_ciudad = $request->input("id_ciudad");
        $id_barrio = $request->input("id_barrio");
        $direccion = $request->input("direccion");
        $latitud = $request->input("latitud");
        $longitud = $request->input("longitud");
        $costo_envio = $request->input("costo_envio");
        $observacion = $request->input("observacion");
        $persona = $request->input("persona");
        $nro_documento = $request->input("nro_documento");
        $telefono = $request->input("telefono");
        $asignado = $request->input("asignado");
        $nombre_asignado = $request->input("nombre_asignado");
        $nro_documento_asignado = $request->input("nro_documento_asignado");
        $telefono_asignado = $request->input("telefono_asignado");
        $tipo_envio = $request->input("tipo_envio");
        $estado = $request->input("estado");
        $productos = $request->input("productos");
        $pago = $request->input("pago");

        $token = $request->token;
        $usuario = $token->usuario;

        $validator = Validator::make($request->all(), [
            'id_usuario'  => 'required',
            'id_sucursal'  => 'required',
            'fecha'  => 'required',
            'costo_envio'  => 'required',
            'tipo_envio'  => 'required',
            'estado'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        // validar que llegaron productos
        if (count($productos) <= 0) {
            return $this->sendResponse(false, 'Debe agregar por lo menos un producto', 400);
        }

        $pedido = Pedido::find($id);
        if ($pedido) {
            $pedido->id_cupon_descuento = $id_cupon_descuento;
            $pedido->id_usuario = $id_usuario;
            $pedido->id_sucursal = $id_sucursal;
            $pedido->fecha = $fecha;
            $pedido->id_ciudad = $id_ciudad;
            $pedido->id_barrio = $id_barrio;
            $pedido->direccion = $direccion;
            $pedido->latitud = $latitud;
            $pedido->longitud = $longitud;
            $pedido->costo_envio = $costo_envio;
            $pedido->observacion = $observacion;
            $pedido->tipo_envio = $tipo_envio;
            $pedido->estado = $estado;
    
            if ($asignado == 'me') {
                $pedido->persona = $persona;
                $pedido->nro_documento = $nro_documento;
                $pedido->telefono = $telefono;
            } else {
                $pedido->persona = $nombre_asignado;
                $pedido->nro_documento = $nro_documento_asignado;
                $pedido->telefono = $telefono_asignado;
            }

            $cliente = Cliente::where('id_usuario', '=', $id_usuario)->first();
            $cliente->razon_social = $persona;
            $cliente->numero_documento = $nro_documento;
            $cliente->celular = $telefono;
            $cliente->save();

            if ($pedido->save()) {
                PedidoItems::where('id_pedido', $id)->delete();
                $total = 0;
                foreach ($productos as $producto) {
                    $item = new PedidoItems();
                    $item->id_pedido = $pedido->identificador;
                    $item->id_producto = $producto['identificador'];
                    $item->precio_venta = $producto['precio_venta'];
                    $item->cantidad = $producto['cantidad'];
                    $item->activo = 'S';
                    $total += ($producto['precio_venta'] * $producto['cantidad']);

                    if (!$item->save()) {
                        return $this->sendResponse(true, 'Producto de pedido no registrados', $item, 400);
                        break;
                    }
                }

                $total += $costo_envio;
                $total_exento += $costo_envio;
                $total_iva5 += $costo_envio;
                $total_iva10 += $costo_envio;

                // actualizar total
                $totalPedido = Pedido::find($pedido->identificador);
                $totalPedido->total = $total;
                if (!$totalPedido->save()) {
                    return $this->sendResponse(true, 'Total de pedido no actualizado', $item, 400);
                }

                if ($pago) {
                    $pagoIt = PedidoPagos::where('id_pedido', '=', $pedido->identificador)->first();
                    if (!$pagoIt) $pagoIt = new PedidoPagos();
                    
                    $pagoIt->id_pedido = $pedido->identificador;
                    $pagoIt->vr_tipo = $pago['tipo'];
                    $pagoIt->total = $total;
                    $pagoIt->importe = (isset($pago['importe'])) ? $pago['importe'] : 0;
                    $pagoIt->vuelto = (isset($pago['importe'])) ? $pago['importe'] - $total : 0;
                    $pagoIt->referencia = ($pagoIt->referencia) ? $pagoIt->referencia : $this->obtenerUltimaReferenciaPago($pedido->identificador);

                    if ($pagoIt->save()) {
                        switch ($pago['tipo']) {
                            case 'ATCD':

                                $tarjeta = new UserTarjetas();
                                $tarjeta->id_usuario = $usuario->identificador;

                                if ($tarjeta->save()) {
                                    $request->request->add([
                                        'user_id' => $usuario->identificador,
                                        'card_id' => $tarjeta->identificador,
                                        'email' => $usuario->email,
                                        'celular' => $usuario->celular
                                    ]);
        
                                    $bancard = new BancardController();
                                    return $bancard->newCard($request);
                                }

                                return $this->sendResponse(false, 'Ha ocurrido un problema al intentar registrar la tarjeta', null, 500);
                            case 'PWTK':

                                $request->request->add([
                                    'user_id' => $usuario->identificador,
                                    'card_id' => $pago['card_id'],
                                    'amount' => $total,
                                    'shop_process_id' => $pagoIt->referencia
                                ]);

                                $bancard = new BancardController();
                                return $bancard->payWithToken($request);
                            case 'BZ':
                            case 'PO':
                                $request->request->add([
                                    'amount' => $total,
                                    'shop_process_id' => $pagoIt->referencia,
                                    'telefono' => $telefono,
                                    'zimple' => $pago['tipo'] == 'BZ' ? 'S' : 'N'
                                ]);

                                $bancard = new BancardController();
                                return $bancard->singleBuy($request);
                            default:
                                return $this->sendResponse(true, 'Pedido registrado correctamente', null, 200);
                        }

                        return $this->sendResponse(true, 'Pedido registrado correctamente', null, 200);
                    }

                    return $this->sendResponse(true, 'Pago de pedido no registrado', $pagoIt, 400);
                }
                
                return $this->sendResponse(true, 'Pedido actualizado', $pedido, 200);
            }
            
            return $this->sendResponse(false, 'Pedido no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro el Pedido', null, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $pedido = Pedido::find($id);
        $devolucion = $request->input("devolucion");
        $usr = $request->input("usr");
        $estado = 'CANCELADO';

        if ($pedido) {

            $pago = PedidoPagos::where('id_pedido', '=', $pedido->identificador)->first();

            if ($devolucion) {
                $estado = 'DEVUELTO';
            } 

            if ($pago) {

                $tipo_envio = $pago->vr_tipo;
                if ($tipo_envio == 'PO') {
                    if ($pedido->save()) {
                        $pago->estado = 'CANCELADO';
                        $pago->save();
                    }
                    $bancard = new BancardController();
                    return $bancard->singleBuyRollback($request, $pago->referencia);
                } else {
                    $pedido->estado = $estado;
                    if ($pedido->save()) {
                        $pago->estado = 'CANCELADO';
                        if ($pago->save()) {
                            $comprobante = Comprobante::where('id_pedido', '=', $id)->first();
                            if ($comprobante) {
                                $comprobante->fec_anulacion = date('Y-m-d H:i:s');
                                $comprobante->usr_anulacion = $usr;
                                if ($comprobante->save()) {
                                    return $this->sendResponse(true, 'Pedido cancelado correctamente', null, 200);
                                }
                            } 
                        }
                        return $this->sendResponse(true, 'Pedido cancelado correctamente', null, 200);
                    }
                    
                    return $this->sendResponse(false, 'Ha ocurrido un problema, por favor intentelo más tarde', false, 500);
                }
            } else {
                $pagoIt = new PedidoPagos();
                $pagoIt->id_pedido = $pedido->identificador;
                $pagoIt->vr_tipo = 'AT'; // AUTO
                $pagoIt->total = 0;
                $pagoIt->importe = 0;
                $pagoIt->vuelto = 0;
                $pagoIt->referencia = 0;
                $pagoIt->estado = 'CANCELADO';

                if ($pagoIt->save()) {

                    $pedido->estado = $estado;
                    if ($pedido->save()) {
                        if ($devolucion) {
                            $comprobante = Comprobante::where('id_pedido', '=', $id)->first();
                            if ($comprobante) {
                                $comprobante->fec_anulacion = date('Y-m-d H:i:s');
                                $comprobante->usr_anulacion = $usr;
                                if ($comprobante->save()) {
                                    return $this->sendResponse(true, 'Pedido cancelado correctamente', null, 200);
                                }
                            } 
                        }
                        return $this->sendResponse(true, 'Pedido cancelado correctamente', null, 200);
                    }
                    
                    return $this->sendResponse(false, 'Ha ocurrido un problema, por favor intentelo más tarde', false, 500);
                }

                return $this->sendResponse(false, 'Ha ocurrido un problema, por favor intentelo más tarde', false, 500);
            }

            
        }

        return $this->sendResponse(false, 'No se encontro el pedido', null, 404);
    }

    public function items(Request $request)
    {        
        $query = PedidoItems::with(['producto']);

        $identificador = $request->query('identificador');
        if ($identificador) {
            $query->where('identificador', '=', $identificador);
        }

        $id_pedido = $request->query('id_pedido');
        if ($id_pedido) {
            $query->where('id_pedido', '=', $id_pedido);
        }
        
        $id_producto = $request->query('id_producto');
        if ($id_producto) {
            $query->where('id_producto', '=', $id_producto);
        }
        
        $cantidad = $request->query('cantidad');
        if ($cantidad) {
            $query->where('cantidad', '=', $cantidad);
        }
        
        $precio_venta = $request->query('precio_venta');
        if ($precio_venta) {
            $query->where('precio_venta', '=', $precio_venta);
        }
       
        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->orderBy('created_at', 'asc')->$listar();
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data, 200);
    }

    public function obtenerUltimaReferenciaPago($idPedido = null) {
        $pago = null;
        if ($idPedido) $pago = PedidoPagos::where('id_pedido', '=', $idPedido)->first();

        if (!$pago) $pago = PedidoPagos::where('referencia', '!=', 0)->latest()->first();

        return (is_object($pago)) ? $pago->referencia + 1 : 1000;
    }

    public function generarOrdenPedido($id) {
        $pedido = Pedido::with(['detalles.producto', 'usuario.cliente', 'sucursal', 'cupon', 'pais', 'ciudad', 'barrio', 'pagos'])->find($id);
        $empresa = Empresa::first();

        if ($pedido) {
            $datos =  [
                'pedido' => $pedido,
                'empresa' => $empresa
            ];
            
            
            $pdf = PDF::loadView('pedido.orden', $datos)->setPaper('A4', 'portrait');  
            return $pdf->stream();

            return view('pedido.orden', $datos);
        }

        return $this->sendResponse(false, 'No se encontro el pedido', null, 404);
    }

    public function cambiarEstado(Request $request, $id)
    {
        $estado = $request->input("estado");
        $mensaje = '';

        $validator = Validator::make($request->all(), [
            'estado'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $pedido = Pedido::find($id);
        if ($pedido) {
            if ($estado == "ENTREGADO") {
                $pago = PedidoPagos::where('id_pedido', '=', $pedido->identificador)->first();
                $pago->estado = 'PAGADO';
                $pago->save();

                $mensaje = "Pedido Finalizado";
            } 
            
            $pedido->estado = $estado;
    
            if ($pedido->save()) {
                if ($estado == "ENTREGADO") {
                    $mensaje = "Pedido Finalizado";
                } else if ($estado == "EN CAMINO") {
                    $mensaje = "Orden generada";
                }
                return $this->sendResponse(true, $mensaje, $pedido, 200);
            }
            
            return $this->sendResponse(false, 'Pedido no finalizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro el Pedido', null, 404);
    }

    /**
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function pagarConTarjetaAgregada(Request $request, $id) {
        $pedido = Pedido::find($id);
        return response()->json($request);
        if ($pedido) {

            $pago = PedidoPagos::where('id_pedido', '=', $id)->first();

            if ($pago) {
                if ($pago->estado != 'PAGADO') {
                    $token = $request->token;
                    $usuario = $token->usuario;

                    $tarjeta = UserTarjetas::where('id_usuario', '=', $usuario->identificador)->last();
        
                    if ($tarjeta) {
                        $request->request->add([
                            'user_id' => $usuario->identificador,
                            'card_id' => $tarjeta->identificador,
                            'amount' => $pago->total,
                            'shop_process_id' => $pago->referencia
                        ]);
        
                        $bancard = new BancardController();
                        return $bancard->payWithToken($request);
                    }
                }
                return $this->sendResponse(true, 'Pedido procesado correctamente', null, 200);
            }

            return $this->sendResponse(false, 'El usuario no tiene ninguna tarjeta asociada', null, 404);

        }

        return $this->sendResponse(false, 'No se ha encontrado el pedido solicitado', null, 404);
    }

    public function generarTicket($id) {
        $pedido = Pedido::with(['detalles.producto', 'usuario.cliente', 'sucursal', 'cupon', 'pais', 'ciudad', 'barrio', 'pagos', 'comprobante.timbrado', 'comprobante.puntoEmision', 'comprobante.usrProceso'])->find($id);
        $empresa = Empresa::first();

        if ($pedido) {
            $datos =  [
                'pedido' => $pedido,
                'empresa' => $empresa
            ];
            
            $paper_size = array(0,0,226.77,526.77);
            $pdf = PDF::loadView('pedido.ticket', $datos)->setPaper($paper_size, 'portrait');  
            return $pdf->stream();

            return view('pedido.orden', $datos);
        }

        return $this->sendResponse(false, 'No se encontro el pedido', null, 404);
    }
}
