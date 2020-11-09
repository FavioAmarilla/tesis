import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedioPagoPage } from './medio-pago.page';
import { ModuloComponentes } from 'src/app/componentes/componentes.module';

const routes: Routes = [
  {
    path: '',
    component: MedioPagoPage
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
  declarations: [MedioPagoPage]
})
export class MedioPagoPageModule {}
