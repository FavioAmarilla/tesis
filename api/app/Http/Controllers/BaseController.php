<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BaseController extends Controller
{
    public function sendResponse($status, $message, $result){
        $response = [
            'status'    => $status,
            'message'   => $message,
        ];

        if (!collect($result)->has('current_page')) { $result = ['data' => $result]; }

        $combined = $response->union($result);

        return response()->json($combined);
    }
}
