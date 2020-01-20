import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFileUploaderModule } from 'angular-file-uploader';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

import { LoginComponent } from '../../pages/login/login.component';
import { TiposImpuestoComponent } from '../../pages/tipos-impuesto/tipos-impuesto.component';
import { EmpresaComponent } from '../../pages/empresa/empresa.component';
import { UsersComponent } from '../../pages/users/users.component';
import { SlidesComponent } from '../../pages/slides/slides.component';
import { ProductoComponent } from '../../pages/producto/producto.component';
import { LineaProductoComponent } from '../../pages/linea-producto/linea-producto.component';
import { PuntosEmisionComponent } from '../../pages/puntos-emision/puntos-emision.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { PaisComponent } from '../../pages/pais/pais.component';
import { CiudadComponent } from '../../pages/ciudad/ciudad.component';
import { BarrioComponent } from '../../pages/barrio/barrio.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFileUploaderModule
  ],
  declarations: [
    DashboardComponent,
    LoginComponent,
    TiposImpuestoComponent,
    EmpresaComponent,
    UsersComponent,
    SlidesComponent,
    LineaProductoComponent,
    ProductoComponent,
    PuntosEmisionComponent,
    ProfileComponent,
    PaisComponent,
    CiudadComponent,
    BarrioComponent
  ]
})

export class AdminLayoutModule {}
