import { Barrio } from './barrio';
import { Ciudad } from './ciudad';
import { Pais } from './pais';
import { Sucursal } from './sucursal';
import { Usuario } from './usuario';
import { PedidoDetalle } from './pedido-detalle';
import { CuponDescuento } from './cupon-descuento';
import { PedidoPago } from './pedido-pago';

export class Pedido {
    constructor(
        public identificador: number,
        public id_cupon_descuento: number,
        public id_usuario: number,
        public id_sucursal: number,
        public fecha: string,
        public id_pais: number,
        public id_ciudad: number,
        public id_barrio: number,
        public direccion: string,
        public latitud: string,
        public longitud: string,
        public costo_envio: number,
        public total: number,
        public observacion: string,
        public persona: string,
        public nro_documento: string,
        public tipo_envio: string,
        public estado: string,
        public detalles: PedidoDetalle,
        public usuario: Usuario,
        public sucursal: Sucursal,
        public cupon: CuponDescuento,
        public pais: Pais,
        public ciudad: Ciudad,
        public barrio: Barrio,
        public pagos: PedidoPago
    ) { }
}
