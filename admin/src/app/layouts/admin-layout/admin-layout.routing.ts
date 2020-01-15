import { Routes } from '@angular/router';

import { UserGuard } from '../../guards/user.guard';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { TableComponent } from '../../pages/table/table.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { LoginComponent } from '../../pages/login/login.component';
import { TiposImpuestoComponent } from '../../pages/tipos-impuesto/tipos-impuesto.component';
import { BusinessComponent } from '../../pages/business/business.component'
import { UsersComponent } from '../../pages/users/users.component'
import { SlidesComponent } from '../../pages/slides/slides.component';
import { ProductsComponent } from '../../pages/products/products.component';
import { LineaProductoComponent } from '../../pages/linea-producto/linea-producto.component';
import { PuntosEmisionComponent } from '../../pages/puntos-emision/puntos-emision.component';
import { ProfileComponent } from '../../pages/profile/profile.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'login',            component: LoginComponent },
    { path: 'dashboard',        component: DashboardComponent, canActivate: [UserGuard] },
    { path: 'empresas',         component: BusinessComponent, canActivate: [UserGuard] },
    { path: 'productos',        component: ProductsComponent, canActivate: [UserGuard] },
    { path: 'usuarios',         component: UsersComponent, canActivate: [UserGuard] },
    { path: 'profile',          component: ProfileComponent, canActivate: [UserGuard] },
    { path: 'tipos-impuesto',   component: TiposImpuestoComponent, canActivate: [UserGuard] },
    { path: 'slides',           component: SlidesComponent, canActivate: [UserGuard] },
    { path: 'table',            component: TableComponent, canActivate: [UserGuard] },
    { path: 'maps',             component: MapsComponent, canActivate: [UserGuard] },
    { path: 'notifications',    component: NotificationsComponent, canActivate: [UserGuard] },
    { path: 'linea-producto',   component: LineaProductoComponent, canActivate: [UserGuard] },
    { path: 'punto-emision',    component: PuntosEmisionComponent, canActivate: [UserGuard] }
];
