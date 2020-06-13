import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatToolbarModule, MatButtonModule, MatMenuTrigger, MatMenu, MatIcon, MatIconModule, MatMenuModule } from '@angular/material';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { UbicacionPage } from './ubicacion/ubicacion.page';
import { UbicacionPageModule } from './ubicacion/ubicacion.module';
import { ProductoComponent } from './producto/producto.component';
import { PipesModule } from '../pipes/pipes.module';
import { LineasModalComponent } from './lineas-modal/lineas-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    FiltrosComponent,
    ProductoComponent,
    LineasModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    UbicacionPageModule,
    RouterModule,
    PipesModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FiltrosComponent,
    ProductoComponent,
    LineasModalComponent
  ],
  entryComponents: [UbicacionPage, LineasModalComponent]
})
export class ModuloComponentes { }
