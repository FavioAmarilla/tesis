<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('user', 'UserController');
Route::group(['prefix' => 'user'], function () {
    Route::post('signIn', 'UserController@signIn');
    Route::post('checkToken', 'UserController@checkToken');
    Route::post('upload', 'UserController@upload');
    Route::get('getImage/{filename}', 'UserController@getImage');
});

Route::resource('producto', 'ProductoController');
Route::group(['prefix' => 'producto'], function () {
    Route::get('search/{search}', 'ProductoController@search');
    Route::post('upload', 'ProductoController@upload');
    Route::get('getImage/{filename}', 'ProductoController@getImage');
});

Route::resource('slide', 'SlideController');
Route::group(['prefix' => 'slide'], function () {
    Route::delete('delete/{id}', 'SlideController@destroy');
    Route::post('upload', 'SlideController@upload');
    Route::get('getImage/{filename}', 'SlideController@getImage');
    Route::get('paginate', 'SlideController@paginate');
});

Route::resource('lineaProducto', 'LineaProductoController');
Route::resource('tipoImpuesto', 'TipoImpuestoController');

Route::resource('empresa', 'EmpresaController');
Route::group(['prefix' => 'empresa'], function () {
    Route::post('upload', 'EmpresaController@upload');
    Route::get('getImage/{filename}', 'EmpresaController@getImage');
});

Route::resource('puntoEmision', 'PuntoEmisionController');
Route::resource('pais', 'PaisController');
Route::resource('ciudad', 'CiudadController');

Route::resource('barrio', 'BarrioController');
Route::group(['prefix' => 'barrio'], function () {
    Route::get('paginate', 'BarrioController@paginate');
});

Route::resource('sucursal', 'SucursalController');