import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { UbicacionPage } from './ubicacion/ubicacion.page';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { UbicacionPageModule } from './ubicacion/ubicacion.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    FiltrosComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCY4IBDW6_CxesXRfvmuGM5sp5elGyd6vI'
    }),
    FormsModule,
    UbicacionPageModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FiltrosComponent,
  ],
  entryComponents: [UbicacionPage]
})
export class ModuloComponentes { }
