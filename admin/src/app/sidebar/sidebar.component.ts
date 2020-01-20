import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',       title: 'Dashboard',             icon: 'fas fa-tachometer-alt'},
    { path: '/empresas',        title: 'Empresa',               icon: 'fas fa-building'},
    { path: '/productos',       title: 'Productos',             icon: 'fas fa-barcode'},
    { path: '/usuarios',        title: 'Usuarios',              icon: 'fas fa-user-friends'},
    { path: '/tipos-impuesto',  title: 'Tipos de impuesto',     icon: 'fas fa-percent'},
    { path: '/slides',          title: 'Banners',               icon: 'far fa-window-restore'},
    { path: '/linea-producto',  title: 'Lineas de productos',   icon: 'fas fa-th-list'},
    { path: '/punto-emision',   title: 'Puntos de emision',     icon: 'fas fa-list-ol'},
    { path: '/pais',            title: 'Paises',                icon: 'fas fa-globe'},
    { path: '/ciudad',          title: 'Ciudades',              icon: 'fas fa-city'},
    { path: '/barrio',          title: 'Barrio',                icon: 'fas fa-map-marker-alt'},
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {


    public menuItems: any[];
    public user: any = null;

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.getUser();

        this.userService.loginEmitter
        .subscribe(response => {
            this.user = response;
            console.log(this.user);
        });

        this.userService.logoutEmitter
        .subscribe(event => {
            this.getUser();
        });
    }

    async getUser() {
        this.user = await this.userService.getUser();
    }

    logout() {
        this.userService.logout();
        this.user = null;
    }
}
