<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Producto;
use App\Sucursal;
use App\Stock;

class ProductoController extends BaseController
{
       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $id_sucursal = $request->query('id_sucursal');
        $query = Producto::with(['lineaProducto', 'tipoImpuesto', 'marca', 
        'stock'=> function($q) use ($id_sucursal) {
            if ($id_sucursal) {
                $q->where('pr_stock.id_sucursal', '=', $id_sucursal);
                $q->where('pr_stock.stock', '>', 0);
            }
        }]);

        $id_linea = $request->query('id_linea');
        if ($id_linea) {
            $query->where('id_linea', '=', $id_linea);
        }

        $id_tipo_impuesto = $request->query('id_tipo_impuesto');
        if ($id_tipo_impuesto) {
            $query->where('id_tipo_impuesto', '=', $id_tipo_impuesto);
        }

        $id_marca = $request->query('id_marca');
        if ($id_marca) {
            $query->where('id_marca', '=', $id_marca);
        }
        
        $vr_unidad_medida = $request->query('vr_unidad_medida');
        if ($vr_unidad_medida) {
            $query->where('vr_unidad_medida', 'LIKE', '%'.$vr_unidad_medida.'%');
        }

        $descripcion = $request->query('descripcion');
        if ($descripcion) {
            $query->where('descripcion', 'LIKE', '%'.$descripcion.'%');
        }

        $codigo_barras = $request->query('codigo_barras');
        if ($codigo_barras) {
            $query->where('codigo_barras', 'LIKE', '%'.$codigo_barras.'%');
        }

        $costo_unitario = $request->query('costo_unitario');
        if ($costo_unitario) {
            $query->where('costo_unitario', '=', $costo_unitario);
        }

        $precio_venta = $request->query('precio_venta');
        if ($precio_venta) {
            $query->where('precio_venta', '=', $precio_venta);
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->orderBy('descripcion', 'asc')->$listar();

        $resultados = [];
        foreach ($data as $element) {
            if ($element->stock) array_push($resultados, $element);
        }

        $data->data = $resultados;

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
        $id_linea = $request->input("id_linea");
        $id_tipo_impuesto = $request->input("id_tipo_impuesto");
        $id_marca = $request->input("id_marca");
        $vr_unidad_medida = $request->input("vr_unidad_medida");
        $descripcion = $request->input("descripcion");
        $codigo_barras = $request->input("codigo_barras");
        $costo_unitario = $request->input("costo_unitario");
        $precio_venta = $request->input("precio_venta");
        $imagen = $request->input("imagen");

        $validator = Validator::make($request->all(), [
            'id_linea'          => 'required', 
            'id_tipo_impuesto'  => 'required', 
            'id_marca'          => 'required', 
            'vr_unidad_medida'  => 'required',  
            'descripcion'       => 'required|unique:pr_productos',
            'codigo_barras'     => 'required|unique:pr_productos',
            'costo_unitario'    => 'required', 
            'precio_venta'      => 'required', 
            'imagen'            => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $producto = new Producto();
        $producto->id_linea = $id_linea;
        $producto->id_tipo_impuesto = $id_tipo_impuesto;
        $producto->vr_unidad_medida = $vr_unidad_medida;
        $producto->id_marca = $id_marca;
        $producto->descripcion = $descripcion;
        $producto->slug = Str::slug($descripcion, '-');
        $producto->codigo_barras = $codigo_barras;
        $producto->costo_unitario = $costo_unitario;
        $producto->precio_venta = $precio_venta;
        $producto->imagen = $imagen;

        if ($producto->save()) {

            $sucursales = Sucursal::all();
            if ($sucursales) {
                foreach ($sucursales as $value) {
                    $stock = new  Stock();
                    $stock->id_sucursal = $value->identificador;
                    $stock->id_producto = $producto->identificador;
        
                    if (!$stock->save()) {
                        return $this->sendResponse(false, 'Stock no registrado', null, 400);
                    }
                }
            }

            return $this->sendResponse(true, 'Producto registrado', $producto, 201);
        }
        
        return $this->sendResponse(false, 'Producto no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $producto = Producto::find($id);

        if (is_object($producto)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $producto, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Producto', null, 404);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function showBySlug($slug)
    {
        $producto = Producto::where('slug', '=', $slug)->first();

        if (is_object($producto)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $producto, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Producto', null, 404);
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
        $id_linea = $request->input("id_linea");
        $id_tipo_impuesto = $request->input("id_tipo_impuesto");
        $id_marca = $request->input("id_marca");
        $vr_unidad_medida = $request->input("vr_unidad_medida");
        $descripcion = $request->input("descripcion");
        $codigo_barras = $request->input("codigo_barras");
        $costo_unitario = $request->input("costo_unitario");
        $precio_venta = $request->input("precio_venta");
        $imagen = $request->input("imagen");
        
        $validator = Validator::make($request->all(), [
            'id_linea'          => 'required', 
            'id_tipo_impuesto'  => 'required', 
            'id_marca'  => 'required', 
            'vr_unidad_medida'  => 'required',  
            'descripcion'       => 'required',
            'codigo_barras'     => 'required',
            'costo_unitario'    => 'required', 
            'precio_venta'      => 'required', 
            'imagen'            => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }
        
        $producto = Producto::find($id);
        if ($producto) {
            $producto->id_linea = $id_linea;
            $producto->id_tipo_impuesto = $id_tipo_impuesto;
            $producto->id_marca = $id_marca;
            $producto->vr_unidad_medida = $vr_unidad_medida;
            $producto->descripcion = $descripcion;
            $producto->slug = Str::slug($descripcion, '-');
            $producto->codigo_barras = $codigo_barras;
            $producto->costo_unitario = $costo_unitario;
            $producto->precio_venta = $precio_venta;
            $producto->imagen = $imagen;
    
            if ($producto->save()) {

                $sucursales = Sucursal::all();
                foreach ($sucursales as $value) {
                    $stock = Stock::where('id_producto', $id)->where('id_sucursal', $value->identificador)->first();
                    if (!$stock) {
                        $stock = new Stock();
                        $stock->id_sucursal = $value->identificador;
                        $stock->id_producto = $producto->identificador;
                        if (!$stock->save()) {
                            return $this->sendResponse(false, 'Stock no registrado', null, 400);
                        }
                    }
                }

                

                return $this->sendResponse(true, 'Producto actualizado', $producto, 200);
            }
            
            return $this->sendResponse(false, 'Producto no actualizado', null, 400);
        }

        return $this->sendResponse(false, 'No se encontro el Producto', null, 404);
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


    public function upload(Request $request){
        $image = $request->file('file0');

        $validator = Validator::make($request->all(), [
            'file0'      =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors(), 400);
        }

        if ($image) {
            $image_name = time().$image->getClientOriginalName();
            Storage::disk('productos')->put($image_name, \File::get($image));

            return $this->sendResponse(true, 'Imagen subida', $image_name, 200);
        }
        
        return $this->sendResponse(false, 'Error al subir imagen', null, 400);
    }

    public function getImage($filename){
        $isset = Storage::disk('productos')->exists($filename);
        if ($isset) {
            $file = Storage::disk('productos')->get($filename);
            return new Response($file);
        }
        
        return $this->sendResponse(false, 'La imagen no existe', null, 404);
    }
    
}
