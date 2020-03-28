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
    public function index(Request $request)
    {
        $query = Empresa::orderBy('codigo', 'asc');

        $codigo = $request->query('codigo');
        if ($codigo) {
            $query->where('codigo', 'LIKE', '%'.$codigo.'%');
        }
        
        $nombre = $request->query('nombre');
        if ($nombre) {
            $query->where('nombre', 'LIKE', '%'.$nombre.'%');
        }

        $numero_documento = $request->query('numero_documento');
        if ($numero_documento) {
            $query->where('numero_documento', 'LIKE', '%'.$numero_documento.'%');
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
        $codigo = $request->input("codigo");
        $nombre = $request->input("nombre");
        $numero_documento = $request->input("numero_documento");
        $imagen = $request->input("imagen");

        $validator = Validator::make($request->all(), [
            'codigo'  => 'required',
            'nombre'  => 'required',
            'numero_documento'  => 'required',
            'imagen'   =>  'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $empresa = new Empresa();
        $empresa->codigo = $codigo;
        $empresa->nombre = $nombre;
        $empresa->numero_documento = $numero_documento;
        $empresa->imagen = $imagen;

        if ($empresa->save()) {
            return $this->sendResponse(true, 'Empresa registrada', $empresa, 201);
        }
        
        return $this->sendResponse(false, 'Empresa no registrada', null, 400);
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
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $empresa, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro la Empresa', null, 404);
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
        $codigo = $request->input("codigo");
        $nombre = $request->input("nombre");
        $numero_documento = $request->input("numero_documento");
        $imagen = $request->input("imagen");
        
        $validator = Validator::make($request->all(), [
            'codigo'  => 'required',
            'nombre'  => 'required',
            'numero_documento'  => 'required',
            'imagen'   =>  'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors());
        }
        

        $empresa = Empresa::find($id);
        if ($empresa) {
            $empresa->codigo = $codigo;
            $empresa->nombre = $nombre;
            $empresa->numero_documento = $numero_documento;
            $empresa->imagen = $imagen;
    
            if ($empresa->save()) {
                return $this->sendResponse(true, 'Empresa actualizada', $empresa, 200);
            }
            
            return $this->sendResponse(false, 'Empresa no actualizada', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro la Empresa', null, 404);
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
            Storage::disk('empresa')->put($image_name, \File::get($image));

            return $this->sendResponse(true, 'Imagen subida', $image_name, 200);
        }
        
        return $this->sendResponse(false, 'Error al subir imagen', null, 400);
    }

    public function getImage($filename){
        $isset = Storage::disk('empresa')->exists($filename);

        if ($isset) {
            $file = Storage::disk('empresa')->get($filename);
            return new Response($file);
        }

        return $this->sendResponse(false, 'La imagen no existe', null, 404);
    }
}
