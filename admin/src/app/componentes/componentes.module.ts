import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaComponent } from './mapa/mapa.component';

@NgModule({
  declarations: [MapaComponent],
  imports: [
    CommonModule
  ],
  exports: [MapaComponent]
})
export class ComponentesModule { }
