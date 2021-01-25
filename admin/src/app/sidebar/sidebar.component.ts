import { Component, OnInit, OnChanges } from '@angular/core';
import { ServicioUsuario } from '../servicios/usuario.service';

export interface RouteInfo {
    url?: string;
    titulo: string;
    icono: string;
    children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
    {
        url: '/dashboard/ventas/pedido',
        titulo: 'Pedidos',
        icono: 'fa fa-home',
    },
    {
        titulo: 'Configuración',
        icono: 'fa fa-laptop',
        children: [
            { url: '/dashboard/configuracion/empresa', titulo: 'Empresas', icono: 'fas fa-building' },
            { url: '/dashboard/configuracion/sucursal', titulo: 'Sucursales', icono: 'fas fa-building' },
            { url: '/dashboard/configuracion/banner', titulo: 'Banners', icono: 'far fa-window-restore' },
            { url: '/dashboard/configuracion/parametro-ec', titulo: 'Parametros Ec.', icono: 'far fa-window-restore' },
            { url: '/dashboard/configuracion/pregunta', titulo: 'Preguntas Frecuentes', icono: 'fas fa-question-circle' },
        ]
    },
    {
        titulo: 'Ventas',
        icono: 'fa fa-shopping-cart',
        children: [
            { url: '/dashboard/ventas/punto-emision', titulo: 'Puntos de emision', icono: 'fas fa-list-ol' },
            { url: '/dashboard/ventas/timbrado', titulo: 'Timbrados', icono: 'fas fa-list-ol' },
            { url: '/dashboard/ventas/cliente', titulo: 'Clientes', icono: 'fas fa-user-friends' },
            { url: '/dashboard/ventas/cupon-descuento', titulo: 'Cupon de Descuentos', icono: 'fas fa-tag' },
        ]
    },
    {
        titulo: 'Productos',
        icono: 'fa fa-barcode',
        children: [
            { url: '/dashboard/producto', titulo: 'Todos los productos', icono: 'fas fa-barcode' },
            { url: '/dashboard/producto/marca', titulo: 'Marcas', icono: 'fas fa-tags' },
            { url: '/dashboard/producto/tipo-impuesto', titulo: 'Tipos de impuesto', icono: 'fas fa-percent' },
            { url: '/dashboard/producto/linea-producto', titulo: 'Lineas de productos', icono: 'fas fa-th-list' },
        ]
    },
    {
        titulo: 'Geografia',
        icono: 'fa fa-globe',
        children: [
            { url: '/dashboard/geografia/pais', titulo: 'Paises', icono: 'fas fa-globe' },
            { url: '/dashboard/geografia/ciudad', titulo: 'Ciudades', icono: 'fas fa-city' },
            { url: '/dashboard/geografia/barrio', titulo: 'Barrios', icono: 'fas fa-map-marker-alt' },
        ]
    },
    {
        titulo: 'Acceso',
        icono: 'fa fa-folder',
        children: [
            { url: '/dashboard/acceso/usuario', titulo: 'Usuarios', icono: 'fas fa-users' },
            { url: '/dashboard/acceso/rol', titulo: 'Roles', icono: 'fas fa-key' },
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
                if (this.usuario) { this.comprobarPermisos(); }
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
        this.comprobarPermisos();
    }

    comprobarPermisos() {
        const permisos = this.usuario.rol.permisos || [];
        permisos.map(permiso => {
            this.comprobar(permiso, this.menuItems);
        });
    }

    comprobar(permiso, items) {
        items.map(item => {
            if (item.url) {
                if (item.url == '/dashboard') {
                    item['autorizado'] = true;
                } else {
                    const array = item.url.split('/');
                    const last = array[array.length - 1];
                    const normalizado = last.toUpperCase().replace(' ', '-').replace('.', '');
                    if (`${normalizado}.LISTAR` == permiso) { item['autorizado'] = true; }
                }
            }

            if (item.children) {
                this.comprobar(permiso, item.children);
                const aux = item.children.find(child => child.autorizado == true);
                item['autorizado'] = !!aux;
            }

        });
    }

    cerrarSession() {
        this.servicioUsuario.cerrarSession();
        this.usuario = null;
    }
}
