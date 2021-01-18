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
    Route::post('validarEmail', ['as' => 'user.validarEmail', 'uses' => 'UserController@validarEmail']);
    Route::post('upload', ['as' => 'user.upload', 'uses' => 'UserController@upload']);
    Route::get('getImage/{filename}', ['as' => 'user.getImage', 'uses' => 'UserController@getImage']);
    Route::post('cambiarPassword', ['as' => 'user.cambiarPassword', 'uses' => 'UserController@cambiarPassword']);
    Route::post('{userId}/tarjetas', ['as' => 'user.tarjetas', 'uses' => 'BancardController@getCards']);
    Route::post('{userId}/tarjeta/{cardId}', ['as' => 'user.eliminar.tarjeta', 'uses' => 'BancardController@deleteCard']);
    Route::post('permisos', ['as' => 'user.permisos', 'uses' => 'UserController@permisos']);
});

Route::group([    
    'namespace' => 'Auth',    
    'middleware' => 'api',    
    'prefix' => 'contrasenha'
], function () {    
    Route::post('crear-token', 'RecuperarContrasenhaController@crearToken');
    Route::get('buscar-token/{token}', 'RecuperarContrasenhaController@buscarToken');
    Route::post('reestablecer', 'RecuperarContrasenhaController@reestablecer');
});

Route::resource('rol', 'RolController');
Route::resource('permiso', 'RolController');
Route::group(['prefix' => 'permiso'], function () {
    Route::get('/', 'RolController@permisos');
});

Route::resource('producto', 'ProductoController');
Route::group(['prefix' => 'producto'], function () {
    Route::get('slug/{slug}', ['as' => 'producto.slug', 'uses' => 'ProductoController@showBySlug']);
    Route::get('search/{search}', ['as' => 'producto.search', 'uses' => 'ProductoController@search']);
    Route::post('upload', ['as' => 'producto.upload', 'uses' => 'ProductoController@upload']);
    Route::get('getImage/{filename}', ['as' => 'producto.getImage', 'uses' => 'ProductoController@getImage']);
});

Route::get('shop', ['as' => 'producto.shop', 'uses' => 'ProductoController@shop']);
Route::group(['prefix' => 'shop'], function () {
    Route::get('producto', ['as' => 'shop.producto', 'uses' => 'ProductoController@shop']);
    Route::get('home', ['as' => 'shop.home', 'uses' => 'ProductoController@shopHome']);
});

Route::resource('slide', 'SlideController');
Route::group(['prefix' => 'slide'], function () {
    Route::post('upload', ['as' => 'slide.upload', 'uses' => 'SlideController@upload']);
    Route::get('getImage/{filename}', ['as' => 'slide.getImage', 'uses' => 'SlideController@getImage']);
});

Route::resource('lineaProducto', 'LineaProductoController');
Route::resource('tipoImpuesto', 'TipoImpuestoController');

Route::resource('empresa', 'EmpresaController');
Route::group(['prefix' => 'empresa'], function () {
    Route::post('upload', ['as' => 'empresa.upload', 'uses' => 'EmpresaController@upload']);
    Route::get('getImage/{filename}', ['as' => 'empresa.getImage', 'uses' => 'EmpresaController@getImage']);
});

Route::resource('puntoEmision', 'PuntoEmisionController');
Route::resource('pais', 'PaisController');
Route::resource('timbrado', 'TimbradoController');

Route::resource('ciudad', 'CiudadController');
Route::group(['prefix' => 'ciudad'], function () {
    Route::post('/{id}/verificarZona', ['as' => 'ciudad.verificarZona', 'uses' => 'CiudadController@verificarZona']);
});

Route::resource('barrio', 'BarrioController');
Route::resource('sucursal', 'SucursalController');
Route::resource('cuponDescuento', 'CuponDescuentoController');
Route::resource('ecParametro', 'EcParametrosController');
Route::resource('ecParamCiudad', 'EcParamCiudadesController');
Route::resource('ecParamSucursal', 'EcParamSucursalesController');
Route::resource('marca', 'MarcaController');

Route::resource('pedido', 'PedidoController', ['middleware' => 'api.auth']);
Route::group(['prefix' => 'pedido'], function () {
    Route::get('{id}/pdf', [ 'as' => 'pedido.pdf', 'uses' => 'PedidoController@generarOrdenPedido']);
    Route::get('{id}/ticket', [ 'as' => 'pedido.ticket', 'uses' => 'PedidoController@generarTicket']);
    Route::post('{id}/estado', [ 'as' => 'pedido.estado', 'uses' => 'PedidoController@cambiarEstado']);
    Route::post('{id}/ultimatarjeta', [ 'as' => 'pedido.ultimatarjeta', 'middleware' => 'api.auth', 'uses' => 'PedidoController@pagarConTarjetaAgregada']);
});

Route::group(['prefix' => 'pedidoItems'], function () {
    Route::get('/', ['as' => 'pedido.items', 'uses' => 'PedidoController@items']);
});

Route::group(['prefix' => 'payment'], function() {
    Route::post('single_buy', ['as' => 'payment.single_buy', 'uses' => 'BancardController@singleBuy']);
    Route::post('confirm', ['as' => 'payment.confirm', 'uses' => 'BancardController@singleBuyConfirm']);
    Route::post('get_confirmation/{shop_process_id}', ['as' => 'payment.get_confirmation', 'uses' => 'BancardController@getSingleBuyConfirmation']);
    Route::post('rollback/{shop_process_id}', ['as' => 'payment.rollback', 'uses' => 'BancardController@singleBuyRollback']);
});

Route::resource('cliente', 'ClienteController');
Route::group(['prefix' => 'cliente'], function () {
    Route::get('usuario/{slug}', ['as' => 'cliente.usuario', 'uses' => 'ClienteController@showByUsuario']);
    Route::get('documento/{numero}', ['as' => 'cliente.validarDocumento', 'uses' => 'ClienteController@validarDocumento']);
});

Route::resource('comprobante', 'ComprobanteController');
Route::resource('pregunta', 'EcPreguntaController');