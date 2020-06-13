import { Usuario } from './usuario';

export class Cliente {
    constructor(
        public identificador: number,
        public id_usuario: number,
        public razon_social: string,
        public numero_documento: string,
        public celular: string,
        public telefono: string
    ) {}
}
