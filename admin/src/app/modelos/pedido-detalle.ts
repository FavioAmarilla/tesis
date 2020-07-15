export class PedidoDetalle {
    constructor(
        public identificador: number,
        public id_pedido: number,
        public id_producto: number,
        public cantidad: number,
        public precio_venta: number,
        public activo: string,
    ) { }
}
