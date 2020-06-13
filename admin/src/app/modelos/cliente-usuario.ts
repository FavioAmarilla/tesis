export class ClienteUsuario {
    constructor(
        public nombre: string,
        public celular: string,
        public telefono: string,
        public numero_documento: string,
        public email: string,
        public clave_acceso: string,
        public fecha_nacimiento: string,
        public imagen: string,
        public id_rol: number
    ) {}
}
