export class CuponDescuento {
    constructor(
        public identificador: number,
        public descripcion: string,
        public codigo: string,
        public porc_desc: number,
        public fecha_desde: string,
        public fecha_hasta: string,
        public usado: string,
    ) { }
}
