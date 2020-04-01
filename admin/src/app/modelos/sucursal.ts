export class Sucursal {
    constructor(
        public identificador: number,
        public id_empresa: number,
        public codigo: string,
        public nombre: string,
        public telefono: string,
        public id_pais: number,
        public id_ciudad: number,
        public direccion: string,
        public ecommerce: string,
        public central: string
    ) {}
}
