import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaginaTienda } from './tienda.page';
import { ModuloComponentes } from '../../componentes/componentes.module';

const routes: Routes = [
  {
    path: '',
    component: PaginaTienda
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModuloComponentes
  ],
  declarations: [PaginaTienda]
})
export class ModuloPaginaTienda {}
