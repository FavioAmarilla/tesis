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

Route::group(['prefix' => 'user'], function () {
    Route::resource('/', 'UserController');
    Route::post('signIn', 'UserController@signIn');
    Route::post('checkToken', 'UserController@checkToken');
    Route::post('upload', 'UserController@upload');
    Route::get('getImage/{filename}', 'UserController@getImage');
    Route::get('show/{id}', 'UserController@show');
    Route::put('update/{id}', 'UserController@update');
    Route::get('paginate', 'UserController@paginate');
});

Route::group(['prefix' => 'producto'], function () {
    Route::resource('/', 'ProductoController');
    Route::put('update/{id}', 'ProductoController@update');
    Route::get('show/{id}', 'ProductoController@show');
    Route::get('search/{search}', 'ProductoController@search');
    Route::post('upload', 'ProductoController@upload');
    Route::get('getImage/{filename}', 'ProductoController@getImage');
    Route::get('paginate', 'ProductoController@paginate');
});

Route::group(['prefix' => 'slide'], function () {
    Route::resource('/', 'SlideController');
    Route::put('update/{id}', 'SlideController@update');
    Route::delete('delete/{id}', 'SlideController@destroy');
    Route::get('show/{id}', 'SlideController@show');
    Route::post('upload', 'SlideController@upload');
    Route::get('getImage/{filename}', 'SlideController@getImage');
    Route::get('paginate', 'SlideController@paginate');
});

Route::group(['prefix' => 'lineaProducto'], function () {
    Route::resource('/', 'LineaProductoController');
    Route::put('update/{id}', 'LineaProductoController@update');
    Route::get('show/{id}', 'LineaProductoController@show');
    Route::get('paginate', 'LineaProductoController@paginate');
});

Route::group(['prefix' => 'tipoImpuesto'], function () {
    Route::resource('/', 'TipoImpuestoController');
    Route::put('update/{id}', 'TipoImpuestoController@update');
    Route::get('show/{id}', 'TipoImpuestoController@show');
    Route::get('paginate', 'TipoImpuestoController@paginate');
});

Route::group(['prefix' => 'empresa'], function () {
    Route::resource('/', 'EmpresaController');
    Route::put('update/{id}', 'EmpresaController@update');
    Route::get('show/{id}', 'EmpresaController@show');
    Route::post('upload', 'EmpresaController@upload');
    Route::get('getImage/{filename}', 'EmpresaController@getImage');
    Route::get('paginate', 'EmpresaController@paginate');
});

Route::group(['prefix' => 'puntoEmision'], function () {
    Route::resource('/', 'PuntoEmisionController');
    Route::put('update/{id}', 'PuntoEmisionController@update');
    Route::get('show/{id}', 'PuntoEmisionController@show');
    Route::get('paginate', 'PuntoEmisionController@paginate');
});

Route::group(['prefix' => 'pais'], function () {
    Route::resource('/', 'PaisController');
    Route::put('update/{id}', 'PaisController@update');
    Route::get('show/{id}', 'PaisController@show');
    Route::get('paginate', 'PaisController@paginate');
});

Route::group(['prefix' => 'ciudad'], function () {
    Route::resource('/', 'CiudadController');
    Route::put('update/{id}', 'CiudadController@update');
    Route::get('show/{id}', 'CiudadController@show');
    Route::get('paginate', 'CiudadController@paginate');
});

Route::group(['prefix' => 'barrio'], function () {
    Route::resource('/', 'BarrioController');
    Route::get('show/{id}', 'BarrioController@show');
    Route::put('update/{id}', 'BarrioController@update');
    Route::get('paginate', 'BarrioController@paginate');
});

Route::group(['prefix' => 'sucursal'], function () {
    Route::resource('/', 'SucursalController');
    Route::get('show/{id}', 'SucursalController@show');
    Route::put('update/{id}', 'SucursalController@update');
    Route::get('paginate', 'SucursalController@paginate');
});