import { Routes } from '@angular/router';

import { UserGuard } from '../../guards/user.guard';

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

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'login',            component: LoginComponent },
    { path: 'dashboard',        component: DashboardComponent, canActivate: [UserGuard] },
    { path: 'empresas',         component: EmpresaComponent, canActivate: [UserGuard] },
    { path: 'productos',        component: ProductoComponent, canActivate: [UserGuard] },
    { path: 'usuarios',         component: UsuariosComponent, canActivate: [UserGuard] },
    { path: 'perfil',          component: PerfilComponent, canActivate: [UserGuard] },
    { path: 'tipos-impuesto',   component: TiposImpuestoComponent, canActivate: [UserGuard] },
    { path: 'slides',           component: CarruselComponent, canActivate: [UserGuard] },
    { path: 'linea-producto',   component: LineaProductoComponent, canActivate: [UserGuard] },
    { path: 'punto-emision',    component: PuntosEmisionComponent, canActivate: [UserGuard] },
    { path: 'pais',             component: PaisComponent, canActivate: [UserGuard] },
    { path: 'ciudad',           component: CiudadComponent, canActivate: [UserGuard] },
    { path: 'barrio',           component: BarrioComponent, canActivate: [UserGuard] }
];
