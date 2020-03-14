<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Producto;

class ProductoController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $productos = Producto::with(['lineaProducto', 'tipoImpuesto'])->orderBy('descripcion', 'desc')->paginate(5);

        return $this->sendResponse($productos, '');
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
        $json = $request->input('json', null);
        $input = json_decode($json, true);

        $validator = Validator::make($input, [
            'id_linea'          => 'required', 
            'id_tipo_impuesto'  => 'required', 
            'vr_unidad_medida'  => 'required',  
            'descripcion'       => 'required|unique:pr_productos',
            'codigo_barras'     => 'required|unique:pr_productos',
            'costo_unitario'    => 'required', 
            'precio_venta'      => 'required', 
            'archivo_img'       => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $producto = new Producto();
        $producto->id_linea = $input['id_linea'];
        $producto->id_tipo_impuesto = $input['id_tipo_impuesto'];
        $producto->vr_unidad_medida = $input['vr_unidad_medida'];
        $producto->descripcion = $input['descripcion'];
        $producto->codigo_barras = $input['codigo_barras'];
        $producto->costo_unitario = $input['costo_unitario'];
        $producto->precio_venta = $input['precio_venta'];
        $producto->archivo_img = $input['archivo_img'];
        $producto->save();

        return $this->sendResponse($producto, 'Producto registrado');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $producto = Producto::find($id)->load('lineaProducto')->load('tipoImpuesto');

        if (is_object($producto)) {
            return $this->sendResponse($producto, '');
        }else{
            return $this->sendError('Producto no definido', null);
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
        $json = $request->input('json', null);
        $input = json_decode($json, true);

        $validator = Validator::make($input, [
            'id_linea'          => 'required', 
            'id_tipo_impuesto'  => 'required', 
            'vr_unidad_medida'  => 'required',  
            'descripcion'       => 'required',
            'codigo_barras'     => 'required',
            'costo_unitario'    => 'required', 
            'precio_venta'      => 'required', 
            'archivo_img'       => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        unset($input['linea_producto']);
        unset($input['tipo_impuesto']);

        $producto = Producto::where('identificador', $id)->update($input);
        return $this->sendResponse($input, 'Producto actualizado');
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

    public function search($search)
    {
        $productos = Producto::where('descripcion','LIKE', "%{$search}%")->orderBy('created_at', 'desc')->get()->load('lineaProducto')->load('tipoImpuesto');

        return $this->sendResponse($productos, '');
    }

    public function upload(Request $request){
        $image = $request->file('file0');

        $validator = Validator::make($request->all(), [
            'file0'      =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $theis->sendError('Error de validacion', $validator->errors());
        }else{
            if ($image) {
                $image_name = time().$image->getClientOriginalName();
                Storage::disk('productos')->put($image_name, \File::get($image));
    
                return $this->sendResponse($image_name, 'Imagen subida');
            }else{
                return $this->sendError('Error al subir imagen', null);
            }    
        }
        return response()->json($data);
    }

    public function getImage($filename){
        $isset = Storage::disk('productos')->exists($filename);
        if ($isset) {
            $file = Storage::disk('productos')->get($filename);
            return new Response($file);
        }else{
            return $this->sendError('La imagen no existe', null);
        }
    }
    
}
