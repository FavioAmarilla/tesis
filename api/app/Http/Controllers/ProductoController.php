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
use App\LineaProducto;
use Illuminate\Support\Facades\DB;

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
        if (!$id_sucursal) {
            $sucursal = Sucursal::where('central', '=', 'S')->first();
            $id_sucursal = $sucursal->identificador;
        }
        
        $query = Producto::with(['lineaProducto', 'tipoImpuesto', 'marca'])->stock($id_sucursal);

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
        
        $slug = $request->query('slug');
        if ($slug) {
            $query->where('slug', '=', $slug);
        }

        //filtros para la tienda
        $lineas = $request->query('lineas');
        if ($lineas) {
            $query->whereIn('id_linea', explode(',', $lineas));
        }

        $marcas = $request->query('marcas');
        if ($marcas) {
            $query->whereIn('id_marca', explode(',', $marcas));
        }

        $order = $request->query('order');
        if (!$order) {
            $order = 'created_at';
            $dir = 'desc';
        }
        if ($order == 'created_at') {
            $order = 'created_at';
            $dir = 'desc';
        }
        if ($order == 'descripcion') {
            $order = 'descripcion';
            $dir = 'asc';
        }
        if ($order == 'precio_asc') {
            $order = 'precio_venta';
            $dir = 'asc';
        }
        if ($order == 'precio_desc') {
            $order = 'precio_venta';
            $dir = 'desc';
        }
        //fin filtros para la tienda

        $paginar = $request->query('paginar');
        $listar = (filter_var($paginar, FILTER_VALIDATE_BOOLEAN)) ? 'paginate' : 'get';

        $data = $query->orderBy($order, $dir)->$listar()->toArray();

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
        $producto = Producto::with(['lineaProducto', 'tipoImpuesto', 'marca'])->find($id);

        if (is_object($producto)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $producto, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Producto', null, 404);
    }

    /**
     * Display the related products of product line.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function related(Request $request, $id)
    {
        $sucursal = $request->get('sucursal');
        if (!$sucursal) {
            $find = Sucursal::where('central', '=', 'S')->first();
            $sucursal = $find->identificador;
        }

        $producto = Producto::find($id);

        if ($producto) {
            $relacionados = Producto::where('id_linea', '=', $producto->id_linea)->stock($sucursal)->where('identificador', '!=', $id)->paginate();
    
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $relacionados, 200);
        }
        
        return $this->sendResponse(true, 'Se listaron exitosamente los registros', [], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param string $slug
     * @return \Illuminate\Http\Response
     */
    public function showBySlug(Request $request, $slug)
    {
        $sucursal = $request->get('sucursal');
        if (!$sucursal) {
            $find = Sucursal::where('central', '=', 'S')->first();
            $sucursal = $find->identificador;
        }
        
        $producto = Producto::with(['lineaProducto', 'tipoImpuesto', 'marca'])->stock($sucursal)->where('slug', '=', $slug)->first();


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
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
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

    public function shopHome(Request $request)
    {
        $id_sucursal = $request->query('sucursal');

        $lineas = DB::select('select pr.id_linea, li.descripcion, sum(it.cantidad) as cantidad
                                from vta_items_comprob it
                                left join pr_productos pr on pr.identificador = it.id_producto
                                left join pr_lineas_prod li on li.identificador = pr.id_linea
                                left join pr_stock st on st.id_producto = pr.identificador
                                where st.id_sucursal='.$id_sucursal.'
                                group by pr.id_linea, li.descripcion
                                order by sum(it.cantidad) desc
                                limit 5');

        $data = array();
        foreach ($lineas as $linea) {
           $productos = DB::select('select distinct pr.*, st.stock
                                    from vta_items_comprob it
                                    left join pr_productos pr on pr.identificador = it.id_producto
                                    left join pr_lineas_prod li on li.identificador = pr.id_linea
                                    left join pr_stock st on st.id_producto = pr.identificador
                                    where st.id_sucursal='.$id_sucursal.' and pr.id_linea='.$linea->id_linea.'
                                    limit 10');

            array_push($data, array('linea' => $linea, 'productos' => $productos));
        }

        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data, 200);
        
    }
}
