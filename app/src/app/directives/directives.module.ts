import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnFocusDirective } from './on-focus.directive';

@NgModule({
  declarations: [
    OnFocusDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OnFocusDirective
  ]
})
export class DirectivesModule { }
