import { Marca } from './marca';

export class Carrusel {
    constructor(
        public identificador: number,
        public titulo: string,
        public descripcion: string,
        public imagen: string,
        public id_marca: number,
        public marca: Marca
    ) { }
}
