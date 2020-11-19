import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSliderModule } from '@angular/material/slider';

import { ProductosPage } from './productos.page';
import { ModuloComponentes } from '../../componentes/componentes.module';
import { PipesModule } from '../../pipes/pipes.module';


const routes: Routes = [
  {
    path: '',
    component: ProductosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModuloComponentes,
    PipesModule,
    NgxPaginationModule,
    MatSliderModule
  ],
  declarations: [ProductosPage]
})
export class ProductosPageModule { }
