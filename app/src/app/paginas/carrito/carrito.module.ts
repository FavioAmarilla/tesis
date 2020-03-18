import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaginaCarrito } from './carrito.page';
import { ModuloComponentes } from '../../componentes/componentes.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { UbicacionPage } from '../modals/ubicacion/ubicacion.page';
import { AgmCoreModule } from '@agm/core';

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
    AgmCoreModule
  ],
  declarations: [PaginaCarrito, UbicacionPage],
  entryComponents: [UbicacionPage]
})
export class ModuloPaginaCarrito { }
