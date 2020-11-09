import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AreaCoberturaPage } from './area-cobertura.page';
import { ModuloComponentes } from 'src/app/componentes/componentes.module';

const routes: Routes = [
  {
    path: '',
    component: AreaCoberturaPage
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
  declarations: [AreaCoberturaPage]
})
export class AreaCoberturaPageModule {}
