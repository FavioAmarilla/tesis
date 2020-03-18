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
    Route::post('signIn', ['as' => 'user.signIn', 'uses' => 'UserController@signIn']);
    Route::post('checkToken', ['as' => 'user.checkToken', 'uses' => 'UserController@checkToken']);
    Route::get('getImage/{filename}', ['as' => 'user.getImage', 'uses' => 'UserController@getImage']);
});

Route::resource('producto', 'ProductoController');
Route::group(['prefix' => 'producto'], function () {
    Route::get('search/{search}', ['as' => 'producto.search', 'uses' => 'ProductoController@search']);
    Route::get('getImage/{filename}', ['as' => 'producto.getImage', 'uses' => 'ProductoController@getImage']);
});

Route::resource('slide', 'SlideController');
Route::group(['prefix' => 'slide'], function () {
    Route::get('getImage/{filename}', ['as' => 'slide.getImage', 'uses' => 'SlideController@getImage']);
});

Route::resource('lineaProducto', 'LineaProductoController');
Route::resource('tipoImpuesto', 'TipoImpuestoController');

Route::resource('empresa', 'EmpresaController');
Route::group(['prefix' => 'empresa'], function () {
    Route::get('getImage/{filename}', ['as' => 'empresa.getImage', 'uses' => 'EmpresaController@getImage']);
});

Route::resource('puntoEmision', 'PuntoEmisionController');
Route::resource('pais', 'PaisController');
Route::resource('ciudad', 'CiudadController');
Route::resource('barrio', 'BarrioController');
Route::resource('sucursal', 'SucursalController');