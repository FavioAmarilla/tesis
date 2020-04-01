import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { UbicacionPage } from './ubicacion/ubicacion.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    FiltrosComponent,
    UbicacionPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCY4IBDW6_CxesXRfvmuGM5sp5elGyd6vI'
    }),
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FiltrosComponent,
    UbicacionPage,
  ],
  entryComponents: [UbicacionPage]
})
export class ModuloComponentes { }
