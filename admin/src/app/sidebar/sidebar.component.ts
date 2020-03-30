import { Component, OnInit, OnChanges } from '@angular/core';
import { ServicioUsuario } from '../servicios/usuario.service';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',       title: 'Dashboard',             icon: 'fas fa-tachometer-alt'},
    { path: '/empresas',        title: 'Empresa',               icon: 'fas fa-building'},
    { path: '/slides',          title: 'Banners',               icon: 'far fa-window-restore'},
    { path: '/punto-emision',   title: 'Puntos de emision',     icon: 'fas fa-list-ol'},

    { path: '/tipos-impuesto',  title: 'Tipos de impuesto',     icon: 'fas fa-percent'},
    { path: '/linea-producto',  title: 'Lineas de productos',   icon: 'fas fa-th-list'},
    { path: '/marca',           title: 'Marcas',                icon: 'fas fa-tags'},
    { path: '/productos',       title: 'Productos',             icon: 'fas fa-barcode'},

    { path: '/pais',            title: 'Paises',                icon: 'fas fa-globe'},
    { path: '/ciudad',          title: 'Ciudades',              icon: 'fas fa-city'},
    { path: '/barrio',          title: 'Barrio',                icon: 'fas fa-map-marker-alt'},
    
    { path: '/usuarios',        title: 'Usuarios',              icon: 'fas fa-user-friends'}
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.scss']
})

export class SidebarComponent implements OnInit {


    public menuItems: any[];
    public usuario: any = null;

    constructor(
        private servicioUsuario: ServicioUsuario
    ) { }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.obtenerUsuario();

        this.servicioUsuario.loginEmitter
        .subscribe(response => {
            this.usuario = response;
            console.log('loginEmitter: ',this.usuario);
        });

        this.servicioUsuario.logoutEmitter
        .subscribe(event => {
            this.obtenerUsuario();
            console.log('logoutEmitter: ',this.usuario);
        });
    }

    async obtenerUsuario() {
        this.usuario = await this.servicioUsuario.obtenerUsuario();
    }

    cerrarSession() {
        this.servicioUsuario.cerrarSession();
        this.usuario = null;
    }
}
