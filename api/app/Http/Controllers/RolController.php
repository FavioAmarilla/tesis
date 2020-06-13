<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Rol;
use App\Permiso;
use App\RolPermisos;

class RolController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Rol::with(['rolPermisos']);

        $nombre = $request->query('nombre');
        if ($nombre) {
            $query->where('nombre', 'LIKE', '%'.$nombre.'%');
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->orderBy('nombre', 'asc')->$listar();

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
        $nombre = $request->input("nombre");
        $permisos = $request->input("permisos");

        $validator = Validator::make($request->all(), [
            'nombre'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $rol = new Rol();
        $rol->nombre = $nombre;
       
        //validar que los datos de permisos llegaron
        if (count($permisos) <= 0) {
            return $this->sendResponse(false, 'Debe agregar por lo un permiso', null, 400);
        }

        if ($rol->save()) {

            foreach ($permisos as $permiso) {
                $rolPermisos = new RolPermisos();
                $rolPermisos->id_rol = $rol->identificador;
                $rolPermisos->id_permiso = $permiso;
                if (!$rolPermisos->save()) {
                    return $this->sendResponse(true, 'Permisos no registrados', $rolPermisos, 201);
                    break;
                }
            }

            return $this->sendResponse(true, 'Rol registrado', $rol, 201);
        }

        return $this->sendResponse(false, 'Rol no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rol = Rol::find($id)->load('rolPermisos.permiso');

        if (is_object($rol)) {
            return $this->sendResponse(true, 'Listado obtenido exitosamente', $rol, 200);
        }
        
        return $this->sendResponse(false, 'No se encontro el Rol', null, 404);
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
        $nombre = $request->input("nombre");
        $permisos = $request->input("permisos");

        $validator = Validator::make($request->all(), [
            'nombre'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        //validar que los datos de permisos llegaron
        if (count($permisos) <= 0) {
            return $this->sendResponse(false, 'Debe agregar al menos un permiso', null, 400);
        }

        $rol = Rol::find($id);
        if ($rol) {
            $rol->nombre = $nombre;

            if ($rol->save()) {
                RolPermisos::where('id_rol', $id)->delete();
                foreach ($permisos as $permiso) {
                    $rolPermisos = new RolPermisos();
                    $rolPermisos->id_rol = $id;
                    $rolPermisos->id_permiso = $permiso;
                    if (!$rolPermisos->save()) {
                        return $this->sendResponse(true, 'Permisos no registrados', $rolPermisos, 201);
                        break;
                    }
                }


                return $this->sendResponse(true, 'Rol actualizado', $rol, 200);
            }

            return $this->sendResponse(false, 'Rol no actualizado', null, 400);
        }

        return $this->sendResponse(false, 'No se encontro el Rol', null, 404);
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

    public function permisos(Request $request)
    {
        $query = Permiso::orderBy('nombre', 'asc');

        $nombre = $request->query('nombre');
        if ($nombre) {
            $query->where('nombre', 'LIKE', '%'.$nombre.'%');
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->$listar();
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data, 200);
    }

}
