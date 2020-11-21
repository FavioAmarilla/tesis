import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { PaginaCarrito } from './carrito.page';
import { ModuloComponentes } from '../../componentes/componentes.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: PaginaCarrito
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
    ScrollingModule
  ],
  declarations: [PaginaCarrito]
})
export class ModuloPaginaCarrito { }
