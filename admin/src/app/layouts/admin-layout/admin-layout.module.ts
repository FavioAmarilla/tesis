import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { NgxPaginationModule } from 'ngx-pagination';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { ComponentesModule } from 'app/componentes/componentes.module';
import { FooterModule } from 'app/shared/footer/footer.module';
import { NavbarModule } from 'app/shared/navbar/navbar.module';
import { SidebarModule } from 'app/sidebar/sidebar.module';

import { DashboardComponent } from '../../paginas/dashboard/dashboard.component';

import { LoginComponent } from '../../paginas/login/login.component';
import { BaseComponent } from '../../paginas/base/base.component';
import { TiposImpuestoComponent } from '../../paginas/tipos-impuesto/tipos-impuesto.component';
import { EmpresaComponent } from '../../paginas/empresa/empresa.component';
import { UsuariosComponent } from '../../paginas/usuarios/usuarios.component';
import { CarruselComponent } from '../../paginas/carrusel/carrusel.component';
import { ProductoComponent } from '../../paginas/producto/producto.component';
import { LineaProductoComponent } from '../../paginas/linea-producto/linea-producto.component';
import { PuntosEmisionComponent } from '../../paginas/puntos-emision/puntos-emision.component';
import { PerfilComponent } from '../../paginas/perfil/perfil.component';
import { PaisComponent } from '../../paginas/pais/pais.component';
import { CiudadComponent } from '../../paginas/ciudad/ciudad.component';
import { BarrioComponent } from '../../paginas/barrio/barrio.component';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { MarcaComponent } from '../../paginas/marca/marca.component';

import { PaginacionComponent } from '../../shared/paginacion/paginacion.component';
import { SucursalComponent } from 'app/paginas/sucursal/sucursal.component';
import { CambiarClaveComponent } from 'app/paginas/cambiar-clave/cambiar-clave.component';
import { RolesComponent } from 'app/paginas/roles/roles.component';
import { EcParametrosComponent  } from 'app/paginas/ec-parametros/ec-parametros.component';
import { TimbradoComponent } from 'app/paginas/timbrado/timbrado.component';
import { ClienteComponent } from 'app/paginas/cliente/cliente.component';
import { PedidosComponent } from 'app/paginas/pedidos/pedidos.component';
import { CuponDescuentoComponent } from 'app/paginas/cupon-descuento/cupon-descuento.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFileUploaderModule,
    NgxPaginationModule,
    ComponentesModule,
    FooterModule,
    NavbarModule,
    SidebarModule
  ],
  declarations: [
    BaseComponent,
    DashboardComponent,
    LoginComponent,
    TiposImpuestoComponent,
    EmpresaComponent,
    UsuariosComponent,
    CarruselComponent,
    LineaProductoComponent,
    ProductoComponent,
    PuntosEmisionComponent,
    PerfilComponent,
    PaisComponent,
    CiudadComponent,
    BarrioComponent,
    PaginacionComponent,
    BreadcrumbComponent,
    MarcaComponent,
    SucursalComponent,
    CambiarClaveComponent,
    RolesComponent,
    EcParametrosComponent,
    TimbradoComponent,
    ClienteComponent,
    PedidosComponent,
    CuponDescuentoComponent
  ]
})

export class AdminLayoutModule {}
