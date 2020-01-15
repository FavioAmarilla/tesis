import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFileUploaderModule } from 'angular-file-uploader';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { TableComponent } from '../../pages/table/table.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';

import { LoginComponent } from '../../pages/login/login.component';
import { TiposImpuestoComponent } from '../../pages/tipos-impuesto/tipos-impuesto.component';
import { BusinessComponent } from '../../pages/business/business.component';
import { UsersComponent } from '../../pages/users/users.component';
import { SlidesComponent } from '../../pages/slides/slides.component';
import { ProductsComponent } from '../../pages/products/products.component';
import { LineaProductoComponent } from '../../pages/linea-producto/linea-producto.component';
import { PuntosEmisionComponent } from '../../pages/puntos-emision/puntos-emision.component';
import { ProfileComponent } from '../../pages/profile/profile.component';

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
    TableComponent,
    MapsComponent,
    NotificationsComponent,
    LoginComponent,
    TiposImpuestoComponent,
    BusinessComponent,
    UsersComponent,
    SlidesComponent,
    LineaProductoComponent,
    ProductsComponent,
    PuntosEmisionComponent,
    ProfileComponent
  ]
})

export class AdminLayoutModule {}
