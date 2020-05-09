export class Ciudad {
    constructor(
        public identificador: number,
        public id_pais: number,
        public nombre: string,
        public poligono?: any[],
        public marcador?: any,
        public length?: any
    ) {}
}
