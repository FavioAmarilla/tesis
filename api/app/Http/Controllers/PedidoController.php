<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Pedido;
use App\PedidoItems;

class PedidoController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Pedido::with(['items', 'sucursal', 'cupon', 'pais', 'ciudad', 'barrio']);

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

        $estado = $request->query('estado');
        if ($estado) {
            $query->where('estado', '=', $estado);
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->orderBy('fecha', 'asc')->$listar();
        
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
        $costo_envio = $request->input("costo_envio");
        $observacion = $request->input("observacion");
        $estado = $request->input("estado");
        $productos = $request->input("productos");
        
        $validator = Validator::make($request->all(), [
            'id_usuario'  => 'required',
            'id_sucursal'  => 'required',
            'fecha'  => 'required',
            'id_pais'  => 'required',
            'id_ciudad'  => 'required',
            'id_barrio'  => 'required',
            'direccion'  => 'required',
            'latitud'  => 'required',
            'longitud'  => 'required',
            'costo_envio'  => 'required',
            'observacion'  => 'required',
            'estado'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
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
        $pedido->estado = $estado;

        //validar que llegaron productos
        if (count($productos) <= 0) {
            return $this->sendResponse(false, 'Debe agregar por lo menos un producto', 400);
        }

        if ($pedido->save()) {
            $total = 0;

            for ($i=0; $i <= count($productos) - 1 ; $i++) {
                $producto = json_decode($productos[$i]);

                $item = new PedidoItems();
                $item->id_pedido = $pedido->identificador;
                $item->id_producto = $productos->id_producto;
                $item->precio_venta = $productos->precio_venta;
                $item->cantidad = $productos->cantidad;
                $item->activo = 'S';
                $total += ($productos->precio_venta * $productos->cantidad);

                if (!$item->save()) {
                    return $this->sendResponse(true, 'Producto de pedido no registrados', $item, 400);
                    break;
                }
            }

            //actualizar total
            $totalPedido = Pedido::find($pedido->identificador);
            $totalPedido->total = $total;
            if ($totalPedido->save()) {
                return $this->sendResponse(true, 'Total de pedido no actualizado', $item, 400);
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
        $pedido = Pedido::find($id)->load('items');

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
        $estado = $request->input("estado");
        $productos = $request->input("productos");

        $validator = Validator::make($request->all(), [
            'id_usuario'  => 'required',
            'id_sucursal'  => 'required',
            'fecha'  => 'required',
            'id_pais'  => 'required',
            'id_ciudad'  => 'required',
            'id_barrio'  => 'required',
            'direccion'  => 'required',
            'latitud'  => 'required',
            'longitud'  => 'required',
            'costo_envio'  => 'required',
            'observacion'  => 'required',
            'estado'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

       //validar que llegaron productos
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
            $pedido->estado = $estado;
    

            if ($parametro->save()) {
                $paramCiudades = PedidoItems::where('id_pedido', $id)->delete();
                $total = 0;
                for ($i=0; $i <= count($productos) - 1 ; $i++) {
                    $producto = json_decode($productos[$i]);
    
                    $item = new PedidoItems();
                    $item->id_pedido = $pedido->identificador;
                    $item->id_producto = $productos->id_producto;
                    $item->precio_venta = $productos->precio_venta;
                    $item->cantidad = $productos->cantidad;
                    $item->activo = 'S';
                    $total += ($productos->precio_venta * $productos->cantidad);
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
}
