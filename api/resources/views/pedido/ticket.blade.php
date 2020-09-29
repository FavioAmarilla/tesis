<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <title>Pedido</title>

    <style>
        * {
            font-size: 11px;
        }

        .ticket {
            width: 250px;
            min-width: 250px;
            max-width: 250px;
        }

        table {
            padding: 0px;
            margin: 0px;
            border: 0px;
        }

        .border-top {
            border-top: 1px dashed black;
        }

        .border-bottom {
            border-bottom: 1px dashed black;
        }

    </style>
</head>

<body>
    <div class="ticket">

        <div class="row cabezera">
            <table>
                <tbody>
                    <tr style="text-align: center;">
                        <td>{{ $empresa->nombre }}</td>
                    </tr>
                    <tr style="text-align: center;">
                        <td>RUC.: {{ $empresa->numero_documento }} TEL.: {{ $pedido->sucursal->telefono }}</td>
                    </tr>
                    <tr style="text-align: center;">
                        <td>{{ $pedido->sucursal->direccion }}</td>
                    </tr>
                    <tr>
                        <td>TIMBRADO NRO.: {{ $pedido->comprobante->timbrado->numero }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <br><br>
        <div class="row sub-cabezera">
            <table>
                <tbody>
                    <tr>
                        <td>LOCAL: {{ $pedido->sucursal->nombre }}</td>
                    </tr>
                    <tr>
                        <td>CAJA: {{ $pedido->comprobante->puntoEmision->nombre }}</td>
                    </tr>
                    <tr>
                        <td>CAJERO: {{ $pedido->comprobante->usrProceso->nombre_completo }}</td>
                    </tr>
                    <tr>
                        <td>FACTURA: {{ $pedido->comprobante->numero }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <br><br>
        <div class="row productos">
            <table>
                <thead class="border-top border-bottom">
                    <tr>
                        <th>Descripcion</th>
                        <th style="text-align: right">Cantidad</th>
                        <th style="text-align: right">Precio</th>
                        <th style="text-align: right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($pedido->detalles as $detalle)
                        <tr>
                            <td>{{ $detalle->producto->descripcion }}</td>
                            <td style="text-align: right">{{ $detalle->cantidad }}</td>
                            <td style="text-align: right">
                                {{ number_format(intval($detalle->precio_venta), 0, ',', '.') }}</td>
                            <td style="text-align: right">
                                {{ number_format(intval($detalle->cantidad * $detalle->precio_venta), 0, ',', '.') }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>


        <div class="row border-top">
            <table>
                <tbody>
                    <tr>
                        <td>TOTAL: {{ number_format($pedido->comprobante->monto_total, 0, ',', '.') }}</td>

                    </tr>
                    @if ($pedido->tipo_envio === 'DE'))
                        <tr>
                            <td>DELIVERY: {{ number_format($pedido->costo_envio, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                </tbody>
            </table>
        </div>


        <div class="row border-top">
            <table>
                <tbody>
                    <tr>
                        @if ($pedido->comprobante->monto_iva5 > 0))
                            <td>GRAVADA 5%: {{ number_format($pedido->comprobante->monto_iva5, 0, ',', '.') }}</td>
                        @endif
                        @if ($pedido->comprobante->monto_iva10 > 0))
                            <td>GRAVADA 12%: {{ number_format($pedido->comprobante->monto_iva10, 0, ',', '.') }}</td>
                        @endif
                        @if ($pedido->comprobante->monto_exento > 0))
                            <td>EXENTO: {{ number_format($pedido->comprobante->monto_exento, 0, ',', '.') }}</td>
                        @endif
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="row border-top">
            <table>
                <tbody>
                    <tr>
                        @if ($pedido->comprobante->monto_iva5 > 0))
                            <td>IVA 5%:
                                {{ number_format(intval($pedido->comprobante->monto_iva5 / 21.0), 0, ',', '.') }}</td>
                        @endif
                        @if ($pedido->comprobante->monto_iva10 > 0))
                            <td>IVA 12%: {{ number_format($pedido->comprobante->monto_iva10 / 11.0, 0, ',', '.') }}</td>
                        @endif
                        @if ($pedido->comprobante->monto_exento > 0))
                            <td>EXENTO: {{ number_format($pedido->comprobante->monto_exento, 0, ',', '.') }}</td>
                        @endif
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="row sub-cabezera border-top">
            <table>
                <tbody>
                    <tr>
                        <td>CLIENTE: {{ $pedido->usuario->cliente->razon_social }}
                        </td>
                        <td>RUC / CI: {{ $pedido->usuario->cliente->numero_documento }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="row border-top">
            <table>
                <tbody>
                    <tr>
                        <td>ARTICULOS: {{ count($pedido->detalles) }} </td>
                        <td>TOTAL: {{ number_format($pedido->comprobante->monto_total, 0, ',', '.') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</body>

</html>
