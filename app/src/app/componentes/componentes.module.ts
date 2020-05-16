import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { UbicacionPage } from './ubicacion/ubicacion.page';
import { FormsModule } from '@angular/forms';
import { UbicacionPageModule } from './ubicacion/ubicacion.module';
import { ProductoComponent } from './producto/producto.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    FiltrosComponent,
    ProductoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    UbicacionPageModule,
    RouterModule,
    PipesModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FiltrosComponent,
    ProductoComponent
  ],
  entryComponents: [UbicacionPage]
})
export class ModuloComponentes { }
