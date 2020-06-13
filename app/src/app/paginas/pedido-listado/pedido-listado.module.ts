import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../pipes/pipes.module';

import { ModuloComponentes } from '../../componentes/componentes.module';
import { PedidoListadoPage } from './pedido-listado.page';
import { MatMenuModule, MatIconModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatListModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: PedidoListadoPage
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
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatGridListModule
  ],
  declarations: [PedidoListadoPage]
})
export class PedidoListadoPageModule { }
