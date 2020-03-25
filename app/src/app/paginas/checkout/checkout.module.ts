import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';

import { CheckoutPage } from './checkout.page';
import { ModuloComponentes } from '../../componentes/componentes.module';
import { UbicacionPage } from '../modals/ubicacion/ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModuloComponentes,
    AgmCoreModule
  ],
  declarations: [CheckoutPage, UbicacionPage],
  entryComponents: [UbicacionPage]
})
export class CheckoutPageModule { }
