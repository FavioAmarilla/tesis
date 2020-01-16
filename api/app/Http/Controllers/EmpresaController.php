<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Empresa;

class EmpresaController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $empresas = Empresa::orderBy('created_at', 'desc')->get();

        return $this->sendResponse($empresas, '');
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
            'nombre'            => 'required|unique:fnd_parm_empresas', 
            'numero_documento'  => 'required', 
            'codigo'            => 'required', 
            'imagen'            => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $empresa = new Empresa();
        $empresa->nombre = $input['nombre'];
        $empresa->numero_documento = $input['numero_documento'];
        $empresa->codigo = $input['codigo'];
        $empresa->imagen = $input['imagen'];
        $empresa->save();

        return $this->sendResponse($empresa, 'Empresa registrada');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $empresa = Empresa::find($id);

        if (is_object($empresa)) {
            return $this->sendResponse($empresa, '');
        }else{
            return $this->sendError('Empresa no definida', null);
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
            'nombre'            => 'required', 
            'numero_documento'  => 'required', 
            'codigo'            => 'required', 
            'imagen'            => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validacion', $validator->errors());
        }

        $empresa = Empresa::where('identificador', $id)->update($input);
        return $this->sendResponse($input, 'Empresa actualizada');
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
            return $this->sendError('Error de validacion', $validator->errors());
        }else{
            if ($image) {
                $image_name = time().$image->getClientOriginalName();
                Storage::disk('empresa')->put($image_name, \File::get($image));
    
                return $this->sendResponse($image_name, 'Imagen subida');
            }else{
                return $this->sendError('Error al subir imagen', null);
            }    
        }
        return response()->json($data);
    }

    public function getImage($filename){
        $isset = Storage::disk('empresa')->exists($filename);
        if ($isset) {
            $file = Storage::disk('empresa')->get($filename);
            return new Response($file);
        }else{
            return $this->sendError('La imagen no existe', null);
        }
    }
}
