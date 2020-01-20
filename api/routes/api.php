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
});

Route::group(['prefix' => 'producto'], function () {
    Route::resource('/', 'ProductoController');
    Route::put('update/{id}', 'ProductoController@update');
    Route::get('show/{id}', 'ProductoController@show');
    Route::get('search/{search}', 'ProductoController@search');
    Route::post('upload', 'ProductoController@upload');
    Route::get('getImage/{filename}', 'ProductoController@getImage');
});

Route::group(['prefix' => 'slide'], function () {
    Route::resource('/', 'SlideController');
    Route::put('update/{id}', 'SlideController@update');
    Route::delete('delete/{id}', 'SlideController@destroy');
    Route::get('show/{id}', 'SlideController@show');
    Route::post('upload', 'SlideController@upload');
    Route::get('getImage/{filename}', 'SlideController@getImage');
});

Route::group(['prefix' => 'lineaProducto'], function () {
    Route::resource('/', 'LineaProductoController');
    Route::put('update/{id}', 'LineaProductoController@update');
    Route::get('show/{id}', 'LineaProductoController@show');
});

Route::group(['prefix' => 'tipoImpuesto'], function () {
    Route::resource('/', 'TipoImpuestoController');
    Route::put('update/{id}', 'TipoImpuestoController@update');
    Route::get('show/{id}', 'TipoImpuestoController@show');
});

Route::group(['prefix' => 'empresa'], function () {
    Route::resource('/', 'EmpresaController');
    Route::put('update/{id}', 'EmpresaController@update');
    Route::get('show/{id}', 'EmpresaController@show');
    Route::post('upload', 'EmpresaController@upload');
    Route::get('getImage/{filename}', 'EmpresaController@getImage');
});

Route::group(['prefix' => 'puntoEmision'], function () {
    Route::resource('/', 'PuntoEmisionController');
    Route::put('update/{id}', 'PuntoEmisionController@update');
    Route::get('show/{id}', 'PuntoEmisionController@show');
});

Route::group(['prefix' => 'pais'], function () {
    Route::resource('/', 'PaisController');
    Route::put('update/{id}', 'PaisController@update');
    Route::get('show/{id}', 'PaisController@show');
});

Route::group(['prefix' => 'ciudad'], function () {
    Route::resource('/', 'CiudadController');
    Route::put('update/{id}', 'CiudadController@update');
    Route::get('show/{id}', 'CiudadController@show');
});

Route::group(['prefix' => 'barrio'], function () {
    Route::resource('/', 'BarrioController');
    Route::put('update/{id}', 'BarrioController@update');
    Route::get('show/{id}', 'BarrioController@show');
});

Route::group(['prefix' => 'sucursal'], function () {
    Route::resource('/', 'SucursalController');
    Route::put('update/{id}', 'SucursalController@update');
    Route::get('show/{id}', 'SucursalController@show');
});