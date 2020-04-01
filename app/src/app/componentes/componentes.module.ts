import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UbicacionPage } from './ubicacion/ubicacion.page';
import { FiltrosComponent } from './filtros/filtros.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    UbicacionPage,
    FiltrosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCY4IBDW6_CxesXRfvmuGM5sp5elGyd6vI'
    }),
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    UbicacionPage,
    FiltrosComponent
  ]
})
export class ModuloComponentes { }
