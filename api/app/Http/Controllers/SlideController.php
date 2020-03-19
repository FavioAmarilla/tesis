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
        $query = Slide::all();

        $titulo = $request->query('titulo');
        if ($titulo) {
            $query->where('titulo', 'LIKE', '%'.$titulo.'%');
        }
        
        $descripcion = $request->query('descripcion');
        if ($descripcion) {
            $query->where('descripcion', 'LIKE', '%'.$descripcion.'%');
        }

        $paginar = $request->query('paginar');
        if ($paginar) {
            $data = $query->orderBy('titulo','asc')->paginate(5);
        }else{
            $data = $query->orderBy('titulo','asc')->get();
        }
        
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
        $titulo = $request->input("titulo");
        $descripcion = $request->input("descripcion");
        $imagen = $request->file('imagen');
        $image_name = time().$imagen->getClientOriginalName();

        $validator = Validator::make($request->all(), [
            'titulo'  => 'required',
            'descripcion'  => 'required',
            'imagen'   =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }

        $slide = new Slide();
        $slide->titulo = $titulo;
        $slide->descripcion = $descripcion;
        $slide->imagen = $image_name;

        if ($slide->save()) {
            Storage::disk('slides')->put($image_name, \File::get($imagen));
            return $this->sendResponse(true, 'Slide registrado', $slide);
        }else{
            return $this->sendResponse(false, 'Slide no registrado', null);
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
        $slide = Slide::find($id);

        if (is_object($slide)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $slide);
        }else{
            return $this->sendResponse(false, 'No se encontro el Banner', null);
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
        $titulo = $request->input("titulo");
        $descripcion = $request->input("descripcion");
        $imagen = $request->file('imagen');
        $image_name = time().$imagen->getClientOriginalName();

        $validator = Validator::make($request->all(), [
            'titulo'  => 'required',
            'descripcion'  => 'required',
            'imagen'   =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }
        

        $slide = Slide::find($id);
        if ($empresa) {
            $slide->titulo = $titulo;
            $slide->descripcion = $descripcion;
            $slide->imagen = $image_name;
    
            if ($slide->save()) {
                Storage::disk('slides')->put($image_name, \File::get($imagen));
                return $this->sendResponse(true, 'Slide actualizado', $slide);
            }else{
                return $this->sendResponse(false, 'Slide no actualizado', null);
            }
        }else{
            return $this->sendResponse(false, 'No se encontro el Slide', null);
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

    public function getImage($filename){
        $isset = Storage::disk('slides')->exists($filename);
        if ($isset) {
            $file = Storage::disk('slides')->get($filename);
            return new Response($file);
        }else{
            return $this->sendError('La imagen no existe', null);
        }
    }
}
