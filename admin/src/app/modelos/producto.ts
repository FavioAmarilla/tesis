export class Producto {
    constructor(
        public identificador: number,
        public id_linea: number,
        public id_tipo_impuesto: number,
        public id_marca: number,
        public vr_unidad_medida: string,
        public descripcion: string,
        public codigo_barras: string,
        public costo_unitario: number,
        public precio_venta: number,
        public imagen: string
    ) {}
};