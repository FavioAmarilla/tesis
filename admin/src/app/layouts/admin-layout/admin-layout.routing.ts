import { Routes } from '@angular/router';

import { UserGuard } from '../../guards/user.guard';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { TableComponent } from '../../pages/table/table.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { LoginComponent } from '../../pages/login/login.component';
import { TiposImpuestoComponent } from '../../pages/tipos-impuesto/tipos-impuesto.component';
import { EmpresaComponent } from '../../pages/empresa/empresa.component'
import { UsersComponent } from '../../pages/users/users.component'
import { SlidesComponent } from '../../pages/slides/slides.component';
import { ProductoComponent } from '../../pages/producto/producto.component';
import { LineaProductoComponent } from '../../pages/linea-producto/linea-producto.component';
import { PuntosEmisionComponent } from '../../pages/puntos-emision/puntos-emision.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { PaisComponent } from '../../pages/pais/pais.component';
import { CiudadComponent } from '../../pages/ciudad/ciudad.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'login',            component: LoginComponent },
    { path: 'dashboard',        component: DashboardComponent, canActivate: [UserGuard] },
    { path: 'empresas',         component: EmpresaComponent, canActivate: [UserGuard] },
    { path: 'productos',        component: ProductoComponent, canActivate: [UserGuard] },
    { path: 'usuarios',         component: UsersComponent, canActivate: [UserGuard] },
    { path: 'profile',          component: ProfileComponent, canActivate: [UserGuard] },
    { path: 'tipos-impuesto',   component: TiposImpuestoComponent, canActivate: [UserGuard] },
    { path: 'slides',           component: SlidesComponent, canActivate: [UserGuard] },
    { path: 'table',            component: TableComponent, canActivate: [UserGuard] },
    { path: 'maps',             component: MapsComponent, canActivate: [UserGuard] },
    { path: 'notifications',    component: NotificationsComponent, canActivate: [UserGuard] },
    { path: 'linea-producto',   component: LineaProductoComponent, canActivate: [UserGuard] },
    { path: 'punto-emision',    component: PuntosEmisionComponent, canActivate: [UserGuard] },
    { path: 'pais',             component: PaisComponent, canActivate: [UserGuard] },
    { path: 'ciudad',           component: CiudadComponent, canActivate: [UserGuard] }
];
