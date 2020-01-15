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
    public function index()
    {
        $slides = Slide::orderBy('created_at','desc')->get();
        return $this->sendResponse($slides, '');
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
            'titulo'       => 'required', 
            'descripcion'  => 'required',
            'archivo_img'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $slide = new Slide();
        $slide->titulo = $input['titulo'];
        $slide->descripcion = $input['descripcion'];
        $slide->archivo_img = $input['archivo_img'];
        $slide->save();

        return $this->sendResponse($slide, 'Slide registrado');
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
            return $this->sendResponse($slide, '');
        }else{
            return $this->sendError('Slide no definido', null);
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
            'titulo'        => 'required',  
            'descripcion'   => 'required',
            'archivo_img'   => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $slide = Slide::where('identificador', $id)->update($input);
        return $this->sendResponse($input, 'Slide actualizado');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $slide = Slide::where('identificador', $id)->first();
        if (empty($slide)) {
            return $this->sendError('Error', 'Slide no encontrado');
        }

        Storage::disk('slides')->delete($slide->archivo_img);
        $delete = $slide->delete();
        if ($delete) {
            return $this->sendResponse(null, 'Slide eliminado');
        }else{
            return $this->sendError(null, 'Slide no eliminado');
        }
    }

    public function upload(Request $request){
        $image = $request->file('file0');

        $validator = Validator::make($request->all(), [
            'file0'      =>  'required|image|mimes:jpeg,jpg,png,gif',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }else{
            if ($image) {
                $image_name = time().$image->getClientOriginalName();
                Storage::disk('slides')->put($image_name, \File::get($image));
    
                return $this->sendResponse($image_name, 'Imagen subida');
            }else{
                return $this->sendError('Error al subir imagen', null);
            }    
        }
        return response()->json($data);
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
