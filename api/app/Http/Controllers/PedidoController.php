<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Http\Controllers\BancardController as BancardController;
use App\Pedido;
use App\PedidoItems;
use App\PedidoPagos;
use App\CuponDescuento;

class PedidoController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Pedido::with(['sucursal', 'cupon', 'pais', 'ciudad', 'barrio', 'pagos']);

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
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

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
        $id_pais = $request->input("id_pais");
        $id_ciudad = $request->input("id_ciudad");
        $id_barrio = $request->input("id_barrio");
        $direccion = $request->input("direccion");
        $latitud = $request->input("latitud");
        $longitud = $request->input("longitud");
        $persona = $request->input("persona");
        $nro_documento = $request->input("nro_documento");
        $costo_envio = $request->input("costo_envio");
        $observacion = $request->input("observacion");
        $tipo_envio = $request->input("tipo_envio");
        $estado = $request->input("estado");
        $productos = $request->input("productos");
        // $pagos = $request->input("pagos");
        
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

        $total = 0;
        foreach ($productos as $producto) {
            $total += $producto['precio_venta'] * $producto['cantidad'];
        }
        $total += $costo_envio;

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
        $pedido->id_pais = $id_pais;
        $pedido->id_ciudad = $id_ciudad;
        $pedido->id_barrio = $id_barrio;
        $pedido->direccion = $direccion;
        $pedido->latitud = $latitud;
        $pedido->longitud = $longitud;
        $pedido->costo_envio = $costo_envio;
        $pedido->observacion = $observacion;
        $pedido->persona = $persona;
        $pedido->nro_documento = $nro_documento;
        $pedido->tipo_envio = $tipo_envio;
        $pedido->estado = $estado;
        $pedido->total = $total;

        //validar que llegaron productos
        if (count($productos) <= 0) {
            return $this->sendResponse(false, 'Debe agregar por lo menos un producto', 400);
        }
        
        //validar que llego los datos del pago
        // if (count($pago) <= 0) {
        //     return $this->sendResponse(false, 'Debe agregar los datos de pago', 400);
        // }

        if ($pedido->save()) {
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

            //actualizar total
            $totalPedido = Pedido::find($pedido->identificador);
            $totalPedido->total = $total;
            if (!$totalPedido->save()) {
                return $this->sendResponse(true, 'Total de pedido no actualizado', $item, 400);
            }

            // registrar datos de pago
            // foreach ($pagos as $pago) {
            //     $pagoIt = new PedidoPagos();
            //     $pagoIt->id_pedido = $pedido->identificador;
            //     $pagoIt->vr_tipo = $pago['vr_tipo'];
            //     $pagoIt->total = $total;
            //     $pagoIt->importe = $pago['importe'];
            //     $pagoIt->vuelto = $pago['importe'] - $total;

            //     if (!$pagoIt->save()) {
            //         return $this->sendResponse(true, 'Pago de pedido no registrado', $pagoIt, 400);
            //         break;
            //     }
            // }

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
        $pedido = Pedido::find($id);

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
        $id_pais = $request->input("id_pais");
        $id_ciudad = $request->input("id_ciudad");
        $id_barrio = $request->input("id_barrio");
        $direccion = $request->input("direccion");
        $latitud = $request->input("latitud");
        $longitud = $request->input("longitud");
        $costo_envio = $request->input("costo_envio");
        $observacion = $request->input("observacion");
        $persona = $request->input("persona");
        $nro_documento = $request->input("nro_documento");
        $tipo_envio = $request->input("tipo_envio");
        $estado = $request->input("estado");
        $productos = $request->input("productos");
        $pago = $request->input("pago");

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
            $pedido->id_pais = $id_pais;
            $pedido->id_ciudad = $id_ciudad;
            $pedido->id_barrio = $id_barrio;
            $pedido->direccion = $direccion;
            $pedido->latitud = $latitud;
            $pedido->longitud = $longitud;
            $pedido->costo_envio = $costo_envio;
            $pedido->observacion = $observacion;
            $pedido->persona = $persona;
            $pedido->nro_documento = $nro_documento;
            $pedido->tipo_envio = $tipo_envio;
            $pedido->estado = $estado;
    

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
                    $pagoIt->referencia = $this->obtenerUltimaReferenciaPago();

                    if ($pagoIt->save()) {
                        if ($pago && $pago['tipo'] == 'PO') {
                            $request->request->add(['amount' => $total]);
                            $request->request->add(['shop_process_id' => $pagoIt->referencia]);

                            $bancard = new BancardController();
                            return $bancard->singleBuy($request);
                        }
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
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

        $data = $query->orderBy('created_at', 'desc')->$listar();
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data, 200);
    }

    public function obtenerUltimaReferenciaPago() {
        $pago = PedidoPagos::latest()->first();

        return (is_object($pago)) ? $pago->referencia + 1 : 1000;
    }
}
