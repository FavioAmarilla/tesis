<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\BaseController as BaseController;

class BancardController extends BaseController
{
    protected $public_key;
    protected $private_key;
    protected $api;

    public function __construct() {
        $this->public_key = env('BANCARD_PUBLIC');
        $this->private_key = env('BANCARD_PRIVATE');
        $this->api = env('BANCARD_API');
    }

    /**
     * Inicia el proceso de pago.
     *
     * @return \Illuminate\Http\Response
     */
    public function singleBuy(Request $request) {

        $front = env('FRONT_URL');
        $currency = "PYG";
        $return_url = $front.'pago_finalizado';
        $cancel_url = $front.'pago_cancelado';

        $amount = $request->input("amount");
        $shop_process_id = $request->input("shop_process_id");
        
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
        
        $respuesta = $this->requestHTTP($url, $data);

        if ($respuesta->status == 'error') return $this->sendResponse(false, 'Ha ocurrido un problema al intentar procesar la solicitud', $respuesta, 500);

        return $this->sendResponse(true, 'Petición realizada correctamente', $respuesta, 200);

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
            return $this->sendResponse(true, 'La transacción ha sido cancelada correctamente', null, 200);
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


            return response()->json(['status' => 'success'], 200);
        }

        return response()->json(['status' => 'error'], 200);
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

            return $this->sendReponse(true, 'Datos de la transacción', $confirmation, 200);
        }

        return $this->sendResponse(false, 'La transacción no ha sido aprobada', null, 400);
    }

    public function requestHTTP($url, $data) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $respuesta = json_decode(curl_exec($ch));
        curl_close($ch);

        return $respuesta;
    }

    public function getPublicData($datos) {
        unset($datos['token']);
        unset($datos['security_information']);
        unset($datos['extended_response_description']);

        return $datos;
    }
}
