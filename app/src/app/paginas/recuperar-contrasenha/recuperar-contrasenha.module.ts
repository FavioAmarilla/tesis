import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecuperarContrasenhaPage } from './recuperar-contrasenha.page';
import { ModuloComponentes } from 'src/app/componentes/componentes.module';

const routes: Routes = [
  {
    path: '',
    component: RecuperarContrasenhaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModuloComponentes,
    RouterModule.forChild(routes)
  ],
  declarations: [RecuperarContrasenhaPage]
})
export class RecuperarContrasenhaPageModule {}
