export class Ciudad {
    constructor(
        public identificador: number,
        public id_pais: number,
        public nombre: string,
        public poligono?: any[]
    ) {}
}
