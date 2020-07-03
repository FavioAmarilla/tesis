import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MiCuentaPage } from './mi-cuenta.page';
import { ModuloComponentes } from '../../componentes/componentes.module';
import {MatTabsModule} from '@angular/material/tabs';
import { MatMenuModule, MatIconModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: MiCuentaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModuloComponentes,
    MatTabsModule,
    MatIconModule,
    MatMenuModule
  ],
  declarations: [MiCuentaPage]
})
export class MiCuentaPageModule { }
