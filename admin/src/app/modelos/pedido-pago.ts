export class PedidoPago {
    constructor(
        public identificador: number,
        public id_pedido: number,
        public referencia: number,
        public process_id: string,
        public vr_tipo: string,
        public total: number,
        public importe: number,
        public vuelto: number,
        public estado: string,
    ) { }
}
