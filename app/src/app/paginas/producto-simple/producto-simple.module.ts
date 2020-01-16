import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaginaProductoSimple } from './producto-simple.page';
import { ModuloComponentes } from '../../componentes/componentes.module';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: PaginaProductoSimple
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModuloComponentes,
    PipesModule
  ],
  declarations: [PaginaProductoSimple]
})
export class ModuloPaginaProductoSimple {}
