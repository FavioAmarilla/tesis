import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {MatTabsModule} from '@angular/material/tabs';
import { MatMenuModule, MatIconModule } from '@angular/material';

import { MiCuentaPage } from './mi-cuenta.page';
import { PipesModule } from '../../pipes/pipes.module';
import { ModuloComponentes } from '../../componentes/componentes.module';

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
    PipesModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule
  ],
  declarations: [MiCuentaPage]
})
export class MiCuentaPageModule { }
