import { Permiso } from './permiso';

export class Rol {
    constructor(
        public identificador: number,
        public nombre: string,
        public permisos?: any
    ) {}
}
