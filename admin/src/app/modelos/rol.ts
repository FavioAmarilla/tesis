export class Rol {
    constructor(
        public identificador: number,
        public nombre: string,
        public permisos?: any,
        public rol_permisos?: any,
        public length?: any
    ) {}
}
