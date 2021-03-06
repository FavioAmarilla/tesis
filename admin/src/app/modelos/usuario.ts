export class Usuario {
    constructor(
        public identificador: number,
        public nombre_completo: string,
        public email: string,
        public clave_acceso: string,
        public imagen: string,
        public fecha_nacimiento: string,
        public telefono: string,
        public celular: string,
        public estado?: number,
        public sub?: number,
        public id_rol?: number,
        public rol?: any
    ) {}
}
