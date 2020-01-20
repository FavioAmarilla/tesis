export class Usuario {
    constructor(
        public identificador: number,
        public nombre_completo: string,
        public email: string,
        public clave_acceso: string,
        public imagen: string
    ) {}
}
