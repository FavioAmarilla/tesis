import { Routes } from '@angular/router';

import { UserGuard } from '../../guards/user.guard';
import { PermisosGuard } from 'app/guards/permisos.guard';

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
import { EcParametrosComponent } from 'app/paginas/ec-parametros/ec-parametros.component';
import { TimbradoComponent } from 'app/paginas/timbrado/timbrado.component';
import { ClienteComponent } from 'app/paginas/cliente/cliente.component';
import { PedidosComponent } from 'app/paginas/pedidos/pedidos.component';
import { CuponDescuentoComponent } from 'app/paginas/cupon-descuento/cupon-descuento.component';
import { PreguntasComponent } from 'app/paginas/preguntas/preguntas.component';

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
                canActivateChild: [PermisosGuard],
                children: [
                    { path: '', redirectTo: 'empresa' },
                    { path: 'empresa', component: EmpresaComponent, data: { breadcrumb: 'Empresas' } },
                    { path: 'sucursal', component: SucursalComponent, data: { breadcrumb: 'Sucursal' } },
                    { path: 'banner', component: CarruselComponent, data: { breadcrumb: 'Carrusel' } },
                    { path: 'parametro-ec', component: EcParametrosComponent, data: { breadcrumb: 'Parametros Ec.' } },
                    { path: 'pregunta', component: PreguntasComponent, data: { breadcrumb: 'Preguntas Frecuentes' } },
                ]
            },
            {
                path: 'ventas',
                data: { breadcrumb: 'Ventas' },
                canActivateChild: [PermisosGuard],
                children: [
                    { path: '', redirectTo: 'punto-emision' },
                    { path: 'punto-emision', component: PuntosEmisionComponent, data: { breadcrumb: 'Punto de Emisión' } },
                    { path: 'timbrado', component: TimbradoComponent, data: { breadcrumb: 'Timbrados' } },
                    { path: 'cliente', component: ClienteComponent, data: { breadcrumb: 'Clientes' } },
                    { path: 'pedido', component: PedidosComponent, data: { breadcrumb: 'Pedidos' } },
                    { path: 'cupon-descuento', component: CuponDescuentoComponent, data: { breadcrumb: 'Cupones de Descuento' } }
                ]
            },
            {
                path: 'producto',
                data: { breadcrumb: 'Productos' },
                canActivateChild: [PermisosGuard],
                children: [
                    { path: '', component: ProductoComponent, data: { breadcrumb: 'Todos los productos' } },
                    { path: 'marca', component: MarcaComponent, data: { breadcrumb: 'Marcas' } },
                    { path: 'linea-producto', component: LineaProductoComponent, data: { breadcrumb: 'Lineas de producto' } },
                    { path: 'tipo-impuesto', component: TiposImpuestoComponent, data: { breadcrumb: 'Tipos de impuesto' } },
                ]
            },
            {
                path: 'geografia',
                data: { breadcrumb: 'Geografía' },
                canActivateChild: [PermisosGuard],
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
                canActivateChild: [PermisosGuard],
                children: [
                    { path: '', redirectTo: 'usuario' },
                    { path: 'usuario', component: UsuariosComponent, data: { breadcrumb: 'Usuarios' } },
                    { path: 'rol', component: RolesComponent, data: { breadcrumb: 'Roles' } }
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
