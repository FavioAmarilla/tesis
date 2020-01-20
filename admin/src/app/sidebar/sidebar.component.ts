import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },
    { path: '/empresas', title: 'Empresa', icon: 'nc-shop', class: '' },
    { path: '/productos', title: 'Productos', icon: 'nc-basket', class: '' },
    { path: '/usuarios', title: 'Usuarios', icon: 'nc-single-02', class: '' },
    { path: '/tipos-impuesto', title: 'Tipos de impuesto', icon: 'nc-tile-56', class: '' },
    { path: '/slides', title: 'Banners', icon: 'nc-image', class: '' },
    { path: '/linea-producto', title: 'Lineas de productos', icon: 'nc-list', class: '' },
    { path: '/punto-emision', title: 'Puntos de emision', icon: 'nc-list', class: '' },
    { path: '/pais', title: 'Paises', icon: 'nc-list', class: '' },
    { path: '/ciudad', title: 'Ciudades', icon: 'nc-list', class: '' },
    { path: '/barrio', title: 'Barrio', icon: 'nc-list', class: '' },
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
