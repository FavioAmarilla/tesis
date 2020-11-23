import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';

import { IonicModule } from '@ionic/angular';

import { PedidoPage } from './pedido.page';
import { ModuloComponentes } from '../../componentes/componentes.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatExpansionModule } from '@angular/material';
import { DirectivesModule } from 'src/app/directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: PedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ModuloComponentes,
    PipesModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule,
    DirectivesModule
  ],
  declarations: [PedidoPage]
})
export class PedidoPageModule { }
