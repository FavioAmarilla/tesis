import { Routes } from '@angular/router';

import { UserGuard } from '../../guards/user.guard';

import { BaseComponent } from '../../paginas/base/base.component';
import { DashboardComponent } from '../../paginas/dashboard/dashboard.component';
import { LoginComponent } from '../../paginas/login/login.component';
import { TiposImpuestoComponent } from '../../paginas/tipos-impuesto/tipos-impuesto.component';
import { EmpresaComponent } from '../../paginas/empresa/empresa.component'
import { UsuariosComponent } from '../../paginas/usuarios/usuarios.component'
import { CarruselComponent } from '../../paginas/carrusel/carrusel.component';
import { ProductoComponent } from '../../paginas/producto/producto.component';
import { LineaProductoComponent } from '../../paginas/linea-producto/linea-producto.component';
import { PuntosEmisionComponent } from '../../paginas/puntos-emision/puntos-emision.component';
import { PerfilComponent } from '../../paginas/perfil/perfil.component';
import { PaisComponent } from '../../paginas/pais/pais.component';
import { CiudadComponent } from '../../paginas/ciudad/ciudad.component';
import { BarrioComponent } from '../../paginas/barrio/barrio.component';
import { MarcaComponent } from 'app/paginas/marca/marca.component';
import { SucursalComponent } from 'app/paginas/sucursal/sucursal.component';
import { CambiarClaveComponent } from 'app/paginas/cambiar-clave/cambiar-clave.component';
import { RolesComponent } from 'app/paginas/roles/roles.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: BaseComponent,
        canActivate: [UserGuard],
        data: { breadcrumb: 'Inicio', icono: 'fa fa-home' },
        children: [
            { path: '', component: DashboardComponent },
            {
                path: 'configuracion',
                data: { breadcrumb: 'Configuración' },
                children: [
                    { path: '', redirectTo: 'empresas' },
                    { path: 'empresas', component: EmpresaComponent, data: { breadcrumb: 'Empresas' } },
                    { path: 'sucursal', component: SucursalComponent, data: { breadcrumb: 'Sucursal' } },
                    { path: 'slides', component: CarruselComponent, data: { breadcrumb: 'Carrusel' } },
                ]
            },
            {
                path: 'ventas',
                data: { breadcrumb: 'Ventas' },
                children: [
                    { path: '', redirectTo: 'punto-emision' },
                    { path: 'punto-emision', component: PuntosEmisionComponent, data: { breadcrumb: 'Punto de Emisión' } },
                ]
            },
            {
                path: 'productos',
                data: { breadcrumb: 'Productos' },
                children: [
                    { path: '', component: ProductoComponent, data: { breadcrumb: 'Todos los productos' } },
                    { path: 'marcas', component: MarcaComponent, data: { breadcrumb: 'Marcas' } },
                    { path: 'linea-producto', component: LineaProductoComponent, data: { breadcrumb: 'Lineas de producto' } },
                    { path: 'tipos-impuesto', component: TiposImpuestoComponent, data: { breadcrumb: 'Tipos de impuesto' } },
                ]
            },
            {
                path: 'geografia',
                data: { breadcrumb: 'Geografía' },
                children: [
                    { path: '', redirectTo: 'pais' },
                    { path: 'pais', component: PaisComponent, data: { breadcrumb: 'Paises' } },
                    { path: 'ciudad', component: CiudadComponent, data: { breadcrumb: 'Ciudades' } },
                    { path: 'barrio', component: BarrioComponent, data: { breadcrumb: 'Barrios' } },
                ]
            },
            {
                path: 'acceso',
                data: { breadcrumb: 'Acceso' },
                children: [
                    { path: '', redirectTo: 'usuarios' },
                    { path: 'usuarios', component: UsuariosComponent, data: { breadcrumb: 'Usuarios' } },
                    { path: 'roles', component: RolesComponent, data: { breadcrumb: 'Roles' } }
                ]
            },
            {
                path: 'cuenta',
                data: { breadcrumb: 'Cuenta' },
                children: [
                    { path: '', redirectTo: 'perfil' },
                    { path: 'perfil', component: PerfilComponent, data: { breadcrumb: 'Perfil' } },
                    { path: 'password', component: CambiarClaveComponent, data: { breadcrumb: 'Cambiar Contraseña' } },
                ]
            }
        ]
    },

];
