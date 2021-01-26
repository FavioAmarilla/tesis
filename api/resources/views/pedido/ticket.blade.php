    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pedido</title>

        <style>
            * {
                margin: 0;
                padding: 0;
                font-size: 11px;
                color: #1E209E;
            }

            body {
                padding: 10pt;
            }

            .row {
                display: block;
                width: 100%;
            }

            .ticket {
                display: block;
                width: 100%;
                min-width: 250px;
                max-width: 300px;
            }

            table, tbody, tr, td {
                width: 100%;
            }

            table {
                padding: 0px;
                margin: 0px;
                border: 0px;
            }

            .border-top {
                border-top: 1px dashed #1E209E !important;
            }

            .border-bottom {
                border-bottom: 1px dashed #1E209E !important;
            }

            .sub-cabecera, .productos, .totales {
                margin-top: 15px;
            }

            .totales, .datos-gravadas, .datos-iva, .datos-cliente, .articulos, .formas-pago {
                padding: 5px 0;
            }

            .footer {
                padding-top: 20px;
            }

        </style>
    </head>

    <body>
        <div class="ticket">

            <div class="row cabezera">
                <table>
                    <tbody>
                        <tr style="text-align: center; text-transform: uppercase;">
                            <td>{{ $empresa->nombre }}</td>
                        </tr>
                        <tr style="text-align: left;">
                            <td>
                                <span style="margin-right: 8px;">RUC.: {{ $empresa->numero_documento }}</span>
                                <span>TEL.: {{ $pedido->sucursal->telefono }}</span>
                            </td>
                        </tr>
                        <tr style="text-align: left;">
                            <td>{{ $pedido->sucursal->direccion }}</td>
                        </tr>
                        <tr style="text-align: left;">
                            <td>TIMBRADO NRO.: {{ $pedido->comprobante->timbrado->numero }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="row sub-cabecera">
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

            <div class="row productos">
                <table>
                    <thead class="border-top border-bottom">
                        <tr>
                            <th style="text-align: left">Descripcion</th>
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
                                <td style="text-align: right">{{ number_format(intval($detalle->precio_venta), 0, ',', '.') }}</td>
                                <td style="text-align: right">
                                    {{ number_format(intval($detalle->cantidad * $detalle->precio_venta), 0, ',', '.') }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="row totales border-top">
                <table>
                    <tbody>
                        <tr>
                            <td colspan="3">TOTAL:</td>
                            <td colspan="1" style="text-align: right;">{{ number_format($pedido->comprobante->monto_total, 0, ',', '.') }}</td>
                        </tr>
                        @if ($pedido->tipo_envio === 'DE'))
                            <tr>
                                <td colspan="3">DELIVERY:</td>
                                <td colspan="1" style="text-align: right;">{{ number_format($pedido->costo_envio, 0, ',', '.') }}</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>

            <div class="row datos-gravadas border-top">
                <table>
                    <tbody>
                        @if ($pedido->comprobante->monto_iva5 > 0)
                            <tr>
                                <td colspan="3">GRAVADA 5%:</td>
                                <td colspan="1" style="text-align: right;">{{ number_format($pedido->comprobante->monto_iva5, 0, ',', '.') }}</td>
                            </tr>
                        @endif
                        @if ($pedido->comprobante->monto_iva10 > 0)
                            <tr>
                                <td colspan="3">GRAVADA 10%:</td>
                                <td colspan="1" style="text-align: right;">{{ number_format($pedido->comprobante->monto_iva10, 0, ',', '.') }}</td>
                            </tr>
                        @endif
                        @if ($pedido->comprobante->monto_exento > 0)
                            <tr>
                                <td colspan="3">EXENTO:</td>
                                <td colspan="1" style="text-align: right;">{{ number_format($pedido->comprobante->monto_exento, 0, ',', '.') }}</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>
        
            <div class="row datos-iva border-top">
                <table>
                    <tbody>
                        @if ($pedido->comprobante->monto_iva5 > 0)
                            <tr>
                                <td colspan="3">IVA 5%:</td>
                                <td colspan="1" style="text-align: right;">{{ number_format(intval($pedido->comprobante->monto_iva5 / 21.0), 0, ',', '.') }}</td>
                            </tr>
                        @endif
                        @if ($pedido->comprobante->monto_iva10 > 0)
                            <tr>
                                <td colspan="3">IVA 10%:</td>
                                <td colspan="1" style="text-align: right;">{{ number_format($pedido->comprobante->monto_iva10 / 11.0, 0, ',', '.') }}</td>
                            </tr>
                        @endif
                        @if ($pedido->comprobante->monto_exento > 0)
                            <tr>
                                <td colspan="3">EXENTO:</td>
                                <td colspan="1" style="text-align: right;">{{ number_format($pedido->comprobante->monto_exento, 0, ',', '.') }}</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>

            <div class="row datos-cliente border-top">
                <table>
                    <tbody>
                        <tr>
                            <td colspan="3">RUC / CI:</td>
                            <td colspan="1" style="text-align: right;">{{ $pedido->usuario->cliente->numero_documento }}</td>
                        </tr>
                        <tr>
                            <td colspan="3">CLIENTE:</td>
                            <td colspan="1" style="text-align: right;">{{ $pedido->usuario->cliente->razon_social }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="row articulos border-top">
                <table>
                    <tbody>
                        <tr>
                            <td colspan="3">ARTICULOS:</td>
                            <td colspan="1" style="text-align: right;">{{ count($pedido->detalles) }}</td>
                        </tr>
                        <tr>
                            <td colspan="3">TOTAL:</td>
                            <td colspan="1" style="text-align: right;">{{ number_format($pedido->comprobante->monto_total, 0, ',', '.') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="row formas-pago border-top">
                <table>
                    <tbody>
                        <tr>
                            <td colspan="4">FORMAS DE PAGOS</td>
                        </tr>
                        <tr>
                            @if ($pedido->pagos->vr_tipo == 'PWTK' || $pedido->pagos->vr_tipo == 'PO' || $pedido->pagos->vr_tipo == 'PCTCD')
                                <td colspan="3">TARJETAS:</td>
                            @elseif ($pedido->pagos->vr_tipo == 'PERC')
                                <td colspan="3">EFECTIVO:</td>
                            @endif
                            <td colspan="1" style="text-align: right;">{{ number_format($pedido->pagos->importe, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td colspan="3">VUELTO:</td>
                            <td colspan="1" style="text-align: right;">{{ number_format($pedido->pagos->vuelto, 0, ',', '.') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="row footer border-top">
                <table>
                    <tbody>
                        <tr style="text-align: center;">
                            <td>---GRACIAS POR SU PREFERENCIA---</td>
                        </tr>
                        <tr style="text-align: center;">
                            <td>ORIGINAL CLIENTE</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </body>

    </html>
