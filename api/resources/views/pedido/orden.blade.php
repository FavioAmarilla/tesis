<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <title>Pedido</title>

    <style>
        * {
            font-size: 12px;
        }
        .cabezera p {
            margin: 0px;
            padding: 0px;
        }
        .cabezera img {
            padding: 10px;
        }
        .cliente p {
            margin: 0px;
            padding: 0px;
        }
        .datos-envio p {
            margin: 0px;
            padding: 0px;
        }
        .derecha{
            text-align: right;
        }
        .row{
            width: 100%;
        }
        .col-md-6{
            width: 50%;
        }   
    </style>
</head>

<body>
    <div class="row cabezera">
        <div class="col">
            <span class="float-left">
                <img src="{{ asset('images/icono-super.png') }}" width="70" height="70">
                
            </span>
            <span class="float-right">
                <p>{{ $empresa->nombre}} - {{ $pedido->sucursal->nombre }}</p>
                <p>R.U.C.: {{ $empresa->numero_documento }} - TEL.: {{ $pedido->sucursal->telefono }}</p>
                <p>{{ $pedido->sucursal->direccion }}</p>
                <p></p>
            </span>
        </div>
    </div>

    <div>   </div>
    <br><br><br><br><br><br>
    <div class="row text-center">
        @if ($pedido->tipo_envio === 'RT')
            <strong style="font-size: 15px">ORDEN DE PEDIDO - RETIRO EN TIENDA</strong>
        @elseif ($pedido->tipo_envio === 'DE')
            <strong style="font-size: 15px">ORDEN DE PEDIDO - DELIVERY</strong>
        @endif
    </div>

    <br><br>
    <div class="row cliente">
        <div class="col">
            <span class="float-left">
                <p> <strong>Razon Social:</strong> {{ $pedido->usuario->cliente->razon_social }}</p>
                <p> <strong>RUC / CI:</strong> {{ $pedido->usuario->cliente->numero_documento }}</p>
                
            </span>
            <span class="float-right">
                @if ($pedido->tipo_envio === 'DE')
                    <p><strong>Pais:</strong> {{ $pedido->pais->nombre }}</p>
                    <p><strong>Ciudad:</strong> {{ $pedido->ciudad->nombre }}</p>
                    <p><strong>Barrio:</strong> {{ $pedido->barrio->nombre }}</p>
                    <p><strong>Direccion:</strong> {{ $pedido->direccion }}</p>                    
                @endif
            </span>
        </div>
    </div>
    
    
    <br><br><br><br><br><br>    
    <div class="row productos">
        @php
            $total = 0;    
        @endphp
        <table class="table" border="0">
            <thead>
              <tr>
                <th>Descripcion</th>
                <th class="derecha">Cantidad</th>
                <th class="derecha">Precio Unitario</th>
                <th class="derecha">Total</th>
              </tr>
            </thead>
            <tbody>
                @foreach ($pedido->detalles as $detalle)
                    <tr>
                        <td>{{ $detalle->producto->descripcion }}</td>
                        <td class="derecha">{{ $detalle->cantidad }}</td>
                        <td class="derecha">{{ number_format(intval($detalle->precio_venta), 0, ",", ".") }}</td>
                        <td class="derecha">{{ number_format(intval($detalle->cantidad * $detalle->precio_venta), 0, ",", ".") }}</td>
                    </tr>
                    @php
                        $total += $detalle->cantidad * $detalle->precio_venta;    
                    @endphp
                @endforeach
            </tbody>
            <tfoot style="border-top: 1px solid #dee2e6;">
                <tr>
                    <td colspan="3"><strong>Totales</strong></td>
                    <td class="derecha"><strong>{{ number_format(intval($total), 0, ",", ".") }}    </strong></td>
                </tr>
            </tfoot>
          </table>
    </div>

    <br><br><br><br><br><br>
    <div class="row firmas">
        <div class="col">
            <span class="float-left">  </span>
            <span class="float-right text-center" style="border-top: thin solid #131313; width: 20%;">  Cliente </span>
        </div>
    </div>
</body>

</html>