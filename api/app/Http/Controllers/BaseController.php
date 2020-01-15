<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BaseController extends Controller
{
    public function sendResponse($result, $message){
        $response = [
            'status'    => true,
            'message'   => $message,
            'data'      => $result
        ];

        return response()->json($response);
    }

    public function sendError($message, $errors = []){
        $response = [
            'status'    => false,
            'message'   => $message
        ];

        if(!empty($errors)){
            $response['data'] = $errors;
        }

        return response()->json($response);
    }
}
