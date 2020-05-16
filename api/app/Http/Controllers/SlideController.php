<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Slide;

class SlideController extends BaseController
{
       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Slide::orderBy('titulo', 'asc');

        $titulo = $request->query('titulo');
        if ($titulo) {
            $query->where('titulo', 'LIKE', '%'.$titulo.'%');
        }
        
        $descripcion = $request->query('descripcion');
        if ($descripcion) {
            $query->where('descripcion', 'LIKE', '%'.$descripcion.'%');
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
        $titulo = $request->input("titulo");
        $descripcion = $request->input("descripcion");
        $imagen = $request->input('imagen');

        $validator = Validator::make($request->all(), [
            'titulo'  => 'required',
            'descripcion'  => 'required',
            'imagen'   =>  'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $slide = new Slide();
        $slide->titulo = $titulo;
        $slide->descripcion = $descripcion;
        $slide->imagen = $imagen;

        if ($slide->save()) {
            return $this->sendResponse(true, 'Slide registrado', $slide, 201);
        }
        
        return $this->sendResponse(false, 'Slide no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $slide = Slide::find($id);

        if (is_object($slide)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $slide, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Banner', null, 404);
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
        $titulo = $request->input("titulo");
        $descripcion = $request->input("descripcion");
        $imagen = $request->input('imagen');

        $validator = Validator::make($request->all(), [
            'titulo'  => 'required',
            'descripcion'  => 'required',
            'imagen'   =>  'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }
        

        $slide = Slide::find($id);
        if ($slide) {
            $slide->titulo = $titulo;
            $slide->descripcion = $descripcion;
            $slide->imagen = $imagen;
    
            if ($slide->save()) {
                return $this->sendResponse(true, 'Slide actualizado', $slide, 200);
            }
            
            return $this->sendResponse(false, 'Slide no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro el Slide', null, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $banner = Slide::find($id);
        
        if ($banner) {
            $banner->activo = ($banner->activo == 'S') ? 'N' : 'S';

            if ($banner->save()) return $this->sendResponse(true, 'El estado del banner ha sido actualizado correctamente', $banner, 200);

            return $this->sendResponse(false, 'Ha ocurrido un problema al intentar actualizar el banner', null, 500);
        }

        return $this->sendResponse(false, 'No se encontro el banner', null, 404);
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
            Storage::disk('slides')->put($image_name, \File::get($image));

            return $this->sendResponse(true, 'Imagen subida', $image_name, 200);
        }
        
        return $this->sendResponse(false, 'Error al subir imagen', null, 400);
    }

    public function getImage($filename){
        $isset = Storage::disk('slides')->exists($filename);
        if ($isset) {
            $file = Storage::disk('slides')->get($filename);
            return new Response($file);
        }
        
        return $this->sendResponse(false, 'La imagen no existe', null, 404);
    }
}
