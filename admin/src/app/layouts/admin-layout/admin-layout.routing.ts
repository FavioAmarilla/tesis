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
        children: [
            { path: '', component: DashboardComponent},
            { path: 'usuarios', component: UsuariosComponent },
            { path: 'empresas', component: EmpresaComponent },
            { path: 'sucursal', component: SucursalComponent },
            { path: 'slides', component: CarruselComponent },

            {
                path: 'productos',
                children: [
                    { path: '', component: ProductoComponent },
                    { path: 'marcas', component: MarcaComponent },
                    { path: 'linea-producto', component: LineaProductoComponent },
                    { path: 'tipos-impuesto', component: TiposImpuestoComponent },
                ]
            },
            { path: 'punto-emision', component: PuntosEmisionComponent },
            {
                path: 'ubicaciones',
                children: [
                    { path: '', redirectTo: 'pais'},
                    { path: 'pais', component: PaisComponent },
                    { path: 'ciudad', component: CiudadComponent },
                    { path: 'barrio', component: BarrioComponent },
                ]
            },
            {
                path: 'administrar',
                children: [
                    { path: '', redirectTo: 'roles' },
                    { path: 'roles', component: RolesComponent }
                ]
            },
            {
                path: 'cuenta',
                children: [
                    { path: '', redirectTo: 'perfil' },
                    { path: 'perfil', component: PerfilComponent },
                    { path: 'password', component: CambiarClaveComponent },
                ]
            }
        ]
    },

];
