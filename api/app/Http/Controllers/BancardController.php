<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\BaseController as BaseController;

use App\User;
use App\Pedido;
use App\PedidoPagos;
use App\UserTarjetas;

class BancardController extends BaseController
{
    protected $public_key;
    protected $private_key;
    protected $api;

    public function __construct() {
        $prodMode = env('BANCARD_PROD_MODE');
        $this->api = ($prodMode) ? env('BANCARD_API_PRODUCTION') : env('BANCARD_API_STAGING');
        $this->public_key = env('BANCARD_PUBLIC');
        $this->private_key = env('BANCARD_PRIVATE');
    }

    /**
     * Inicia el proceso de pago.
     *
     * @return \Illuminate\Http\Response
     */
    public function singleBuy(Request $request) {

        $front = env('FRONT_URL');
        $currency = "PYG";
        $return_url = $front.'pedido/finalizado';
        $cancel_url = $front.'pedido/finalizado';

        $amount = $request->input("amount");
        $shop_process_id = $request->input("shop_process_id");
        $telefono = $request->input("telefono");
        $zimple = $request->input("zimple");
        
        $amount = str_replace(",", "", number_format($amount, 2));

        $token = md5($this->private_key.$shop_process_id.$amount.$currency);

        $url = "$this->api/single_buy";
        $data = json_encode(array(
            "public_key" => "$this->public_key",
            "operation"  => array(
                "token" => "$token",
                "shop_process_id" => $shop_process_id,
                "amount" => "$amount",
                "currency" => "$currency",
                "description" => "Pago de prueba desde la app",
                "return_url" => "$return_url",
                "cancel_url" => "$cancel_url"
            )
        ));

        if ($zimple == 'S') {
            $data['operation']['additional_data'] = $telefono;
            $data['operation']['zimple'] = 'S';
        }
        
        $respuesta = $this->requestHTTP($url, $data);

        if ($respuesta->status == 'error') return $this->sendResponse(false, 'Ha ocurrido un problema al intentar procesar la solicitud', $respuesta, 500);

        $pago = PedidoPagos::where('referencia', '=', $shop_process_id)->first();
        if ($pago) {

            $pago->process_id = $respuesta->process_id;
            if ($pago->save()) return $this->sendResponse(true, 'Petición realizada correctamente', $respuesta, 200);

            return $this->sendResponse(false, 'Ha ocurrido un problema al procesar el pago', null, 400);
        }

        return $this->sendResponse(false, 'Ha ocurrido un problema, por favor intentelo más tarde', null, 400);
    }

    /**
     * Permite cancelar el pago (ocasional o con token).
     *
     * @return \Illuminate\Http\Response
     */
    public function singleBuyRollback(Request $request, $shop_process_id) {

        $token = md5($this->private_key.$shop_process_id."rollback"."0.00");

        $url = "$this->api/single_buy/rollback";
        $data = json_encode(array(
            "public_key" => "$this->public_key",
            "operation"  => array(
                "token" => "$token",
                "shop_process_id" => $shop_process_id
            )
        ));

        $respuesta = $this->requestHTTP($url, $data);

        if ($respuesta->status == 'success') {

            $pago = PedidoPagos::where('referencia', '=', $shop_process_id)->first();

            if ($pago) {
                $pago->estado = 'CANCELADO';

                if ($pago->save()) {
                    $pedido = Pedido::find($pedido->id_pedido);

                    if ($pedido) {
                        $pedido->estado = 'CANCELADO';

                        if ($pedido->save()) {
                            return $this->sendResponse(true, 'La transacción ha sido cancelada correctamente', null, 200);
                        }

                        return $this->sendResponse(false, 'Ha ocurrido un problema al intentar actualizar el estado del pedido', null, 500);
                    }

                    return $this->sendResponse(false, 'Ha ocurrido un problema al intentar actualizar el estado del pedido', null, 404);
                }

                return $this->sendResponse(false, 'Ha ocurrido un problema al intentar cancelar la transacción', null, 500);
            }

            return $this->sendResponse(false, 'Ha ocurrido un problema al intentar cancelar la transacción', null, 404);

        }

        return $this->sendResponse(false, 'No se pudo cancelar la transacción', null, 400);

    }

    /**
     * operación que será invocada por VPOS para confirmar un pago
     * (ocasional o con token)
     *
     * @return \Illuminate\Http\Response
     */
    public function singleBuyConfirm(Request $request) {
        
        // 00 (transacción aprobada)
        // 05 (Tarjeta inhabilitada)
        // 12 (Transacción inválida)
        // 15 (Tarjeta inválida)
        // 51 (Fondos insuficientes)
        
        $operation = $request->get('operation');

        // $shop_process_id = $operation['shop_process_id'];
        // $amount = $operation['amount'];
        // $currency = "PYG";

        if ($operation['response'] == 'S' && $operation['response_code'] == '00') {
            // $token = md5($this->private_key.$shop_process_id."confirm".$amount.$currency);

            // Actualizar pago del pedido
            $pago = PedidoPagos::where('referencia', '=', $operation['shop_process_id'])->first();

            if ($pago) {
                $pago->estado = 'PAGADO';
                $pago->process_id = NULL;

                if ($pago->save()) {
                    $producto = Pedido::find($pago->id_pedido);
    
                    if ($producto) { }
    
                    return response()->json(['status' => 'success'], 200);
                }

                return response()->json(['status' => 'error'], 400);
            }

            return response()->json(['status' => 'error'], 400);
        }

        return response()->json(['status' => 'error'], 400);
    }

    /**
     * operación para consulta, si un pago (ocasional o con token)
     * fue confirmado o no.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $shop_process_id
     * @return \Illuminate\Http\Response
     */
    public function getSingleBuyConfirmation(Request $request, $shop_process_id) {

        $token = md5($this->private_key.$shop_process_id."get_confirmation");

        $url = "$this->api/single_buy/confirmations";
        $data = json_encode(array(
            "public_key" => "$this->public_key",
            "operation"  => array(
                "token" => "$token",
                "shop_process_id" => $shop_process_id
            )
        ));

        $respuesta = $this->requestHTTP($url, $data);

        if ($respuesta->status == 'success') {
            $confirmation = $this->getPublicData($respuesta["confirmation"]);

            return $this->sendResponse(true, 'Datos de la transacción', $confirmation, 200);
        }

        return $this->sendResponse(false, 'La transacción no ha sido aprobada', null, 400);
    }

    /**
     * Inicia el proceso de catastro de una tarjeta de credito/debito
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
    */
    public function newCard(Request $request) {

        $front = env('FRONT_URL');
        $user_id = $request->get('user_id');
        $card_id = $request->get('card_id');
        $pedido = $request->get('pedido');

        $token = md5($this->private_key.$card_id.$user_id."request_new_card");
        $return_url = $front.'pedido/finalizado?pedido='.$pedido;

        $url = "$this->api/cards/new";
        $data = json_encode(array(
            "public_key" => $this->public_key,
            "operation" => array(
                "token" => $token,
                "card_id" => $card_id,
                "user_id" => $user_id,
                "user_cell_phone" => $request->get('celular'),
                "user_mail" => $request->get('email'),
                "return_url" => $return_url,
            )
        ));

        $respuesta = $this->requestHTTP($url, $data);

        if ($respuesta->status == 'success') {

            $usuario = User::find($user_id);
            $usuario->tiene_tarjetas = 1;
            $usuario->save();

            return $this->sendResponse(true, 'Datos de la solicitud', $respuesta, 200);
        }

        return $this->sendResponse(false, 'Ha ocurrido un problema al procesar la solicitud', null, 400);
    }

    /**
     * Utiliza el alias token de la tarjeta catastrada para realizar el pago
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
    */
    public function payWithToken(Request $request) {

        $currency = "PYG";
        $userId = $request->get('user_id');
        $cardId = $request->get('card_id');
        $amount = $request->get('amount');
        $shop_process_id = $request->get('shop_process_id');

        $amount = str_replace(",", "", number_format($amount, 2)); 

        $token = md5($this->private_key.$userId."request_user_cards");

        $url = "$this->api/users/$userId/cards";
        $data = json_encode(array(
            "public_key" => $this->public_key,
            "operation" => array(
                "token" => $token
            )
        ));

        $respuesta = $this->requestHTTP($url, $data);

        if ($respuesta->status == 'success') {

            $alias_token = null;
            foreach ($respuesta->cards as $card) {
                if ($card->card_id == $cardId) {
                    $alias_token = $card->alias_token;
                    break;
                }
            }

            if ($alias_token) {
                $token = md5($this->private_key.$shop_process_id."charge".$amount.$currency.$alias_token);

                $url = "$this->api/charge";
                $data = json_encode(array(
                    "public_key" => $this->public_key,
                    "operation" => array(
                        "token" => $token,
                        "shop_process_id" => $shop_process_id,
                        "amount" => $amount,
                        "number_of_payments" => 1,
                        "currency" => "PYG",
                        "alias_token" => $alias_token,
                        "additional_data" => "",
                        "description" => "Pago de pedido $shop_process_id"
                    )
                ));

                $respuesta = $this->requestHTTP($url, $data);
                
                if ($respuesta->status == 'success') {
                    $confirmation = $respuesta->confirmation;

                    // Actualizar pago del pedido
                    $pago = PedidoPagos::where('referencia', '=', $confirmation->shop_process_id)->first();

                    if ($pago) {
                        $pago->estado = 'PAGADO';
                        $pago->process_id = NULL;

                        if ($pago->save()) {
                            return $this->sendResponse(true, 'Pago procesado correctamente', null, 200);
                        }

                        return $this->sendResponse(false, 'Ha ocurrido un problema al intentar actualizar el pago del pedido', null, 400);
                    }

                    return $this->sendResponse(true, 'Pago procesado correctamente', null, 200);
                }
            }
        }
    
        return $this->sendResponse(false, 'No se ha encontrado la tarjeta solicitada para proceder con el pago', null, 404);
    }

    /**
     * Obtiene las tarjetas del usuario
     * 
     * @param  int $userId
     * @return \Illuminate\Http\Response
    */
    public function getCards($userId) {

        $token = md5($this->private_key.$userId."request_user_cards");

        $url = "$this->api/users/$userId/cards";
        $data = json_encode(array(
            "public_key" => $this->public_key,
            "operation" => array(
                "token" => $token
            )
        ));

        $respuesta = $this->requestHTTP($url, $data);

        if ($respuesta->status == 'success') {
            $confirmation = $this->getPublicData($respuesta);

            return $this->sendResponse(true, 'Tarjetas obtenidas correctamente', $confirmation->cards, 200);
        }

        return $this->sendResponse(false, 'No se encontraron tarjetas para el usuario', null, 404);
    }

    /**
     * Elimina una de las tarjetas del usuario
     * 
     * @param  int $userId
     * @param  int $cardId
     * @return \Illuminate\Http\Response
    */
    public function deleteCard($userId, $cardId) {

        $token = md5($this->private_key.$userId."request_user_cards");

        $url = "$this->api/users/$userId/cards";
        $data = json_encode(array(
            "public_key" => $this->public_key,
            "operation" => array(
                "token" => $token
            )
        ));

        $respuesta = $this->requestHTTP($url, $data);

        if ($respuesta->status == 'success') {

            $alias_token = null;
            foreach ($respuesta->cards as $card) {
                if ($card->card_id == $cardId) {
                    $alias_token = $card->alias_token;
                    break;
                }
            }

            if ($alias_token) {
                $token = md5($this->private_key."delete_card".$userId.$alias_token);
                $data = json_encode(array(
                    "public_key" => $this->public_key,
                    "operation" => array(
                        "token" => $token,
                        "alias_token" => $alias_token
                    )
                ));

                $respuesta = $this->requestHTTP($url, $data, 'delete');

                if ($respuesta->status == 'success') {

                    $usuario = User::find($userId);
                    $usuario->tiene_tarjetas = (count($respuesta->cards) - 1 < 1) ? 0 : 1;
                    $usuario->save();

                    $tarjeta = UserTarjetas::find($cardId);
                    if ($tarjeta->delete()) {
                        return $this->sendResponse(true, 'La tarjeta ha sido removida correctamente', null, 200);
                    }

                }

                return $this->sendResponse(false, 'Ha ocurrido un problema al intentar eliminar la tarjeta', null, 400);
            }

            return $this->sendResponse(false, 'No se encontro la tarjeta', null, 404);
        }

        return $this->sendResponse(false, 'Ha ocurrido un problema al intentar eliminar la tarjeta', null, 400);
    }

    public function requestHTTP($url, $data, $method = "post") {
        $ch = curl_init($url);
        if ($method == 'post') { curl_setopt($ch, CURLOPT_POST, 1); }
        else if ($method == 'delete') { curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE"); }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $respuesta = json_decode(curl_exec($ch));
        curl_close($ch);

        return $respuesta;
    }

    public function getPublicData($datos) {
        if (is_array($datos)) {
            if (isset($datos['token']))                         unset($datos['token']);
            if (isset($datos['security_information']))          unset($datos['security_information']);
            if (isset($datos['extended_response_description'])) unset($datos['extended_response_description']);
        }

        if (is_object($datos)) {
            if (isset($datos->cards)) {
                foreach ($datos->cards as $card) {
                    unset($card->alias_token);
                }
            }
        }

        return $datos;
    }
}
