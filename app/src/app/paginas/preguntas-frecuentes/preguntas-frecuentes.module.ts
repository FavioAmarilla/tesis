import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PreguntasFrecuentesPage } from './preguntas-frecuentes.page';
import { ModuloComponentes } from '../../componentes/componentes.module';

const routes: Routes = [
  {
    path: '',
    component: PreguntasFrecuentesPage
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
  declarations: [PreguntasFrecuentesPage]
})
export class PreguntasFrecuentesPageModule { }
