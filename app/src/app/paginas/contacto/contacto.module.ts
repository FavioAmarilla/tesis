import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaginaContacto } from './contacto.page';
import { ModuloComponentes } from '../../componentes/componentes.module';
import { AgmCoreModule } from '@agm/core';

const routes: Routes = [
  {
    path: '',
    component: PaginaContacto
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModuloComponentes,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBuZNII7koDWPXeKDT9IeSEuWezvQqlZ8c'
    }),
  ],
  declarations: [PaginaContacto]
})
export class ModuloPaginaContacto {}
