import { Component, OnInit, OnChanges } from '@angular/core';
import { ServicioUsuario } from '../servicios/usuario.service';

export interface RouteInfo {
    path?: string;
    title: string;
    icon: string;
    children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
    },
    { path: '/dashboard/usuarios', title: 'Usuarios', icon: 'fas fa-user-friends' },
    { path: '/dashboard/empresas', title: 'Empresa', icon: 'fas fa-building' },
    { path: '/dashboard/sucursal', title: 'Sucursales', icon: 'fas fa-building' },
    { path: '/dashboard/slides', title: 'Banners', icon: 'far fa-window-restore' },
    { path: '/dashboard/punto-emision', title: 'Puntos de emision', icon: 'fas fa-list-ol' },
    {
        path: '/dashboard/productos',
        title: 'Productos',
        icon: '',
        children: [
            { path: '/dashboard/productos', title: 'Todos los productos', icon: 'fas fa-barcode' },
            { path: '/dashboard/productos/marcas', title: 'Marcas', icon: 'fas fa-tags' },
            { path: '/dashboard/productos/tipos-impuesto', title: 'Tipos de impuesto', icon: 'fas fa-percent' },
            { path: '/dashboard/productos/linea-producto', title: 'Lineas de productos', icon: 'fas fa-th-list' },
        ]
    },
    {
        path: '/dashboard/ubicaciones',
        title: 'Ubicaciones',
        icon: '',
        children: [
            { path: '/dashboard/ubicaciones/pais', title: 'Paises', icon: 'fas fa-globe' },
            { path: '/dashboard/ubicaciones/ciudad', title: 'Ciudades', icon: 'fas fa-city' },
            { path: '/dashboard/ubicaciones/barrio', title: 'Barrio', icon: 'fas fa-map-marker-alt' },
        ]
    },
    {
        path: '/dashboard/administrar',
        title: 'Administrar',
        icon: '',
        children: [
            { path: '/dashboard/administrar/roles', title: 'Roles', icon: 'fas fa-key' },
        ]
    }
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
            // console.log('loginEmitter: ', this.usuario);
        });

        this.servicioUsuario.logoutEmitter
        .subscribe(event => {
            this.obtenerUsuario();
            // console.log('logoutEmitter: ', this.usuario);
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
