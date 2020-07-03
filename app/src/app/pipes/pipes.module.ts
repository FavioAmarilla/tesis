import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlSanitizerPipe } from './url-sanitizer.pipe';
import { ProductImagePipe } from './product-image.pipe';
import { SlideImagePipe } from './slide-image.pipe';
import { LineaProductoImagePipe } from './linea-producto-image.pipe';
import { TruncateTextPipe } from './truncate-text.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { UnidadMedidaPipe } from './unidad-medida.pipe';
import { SpaceBetweenLettersPipe } from './space-between-letters.pipe';
import { CardBrandPipe } from './card-brand.pipe';

@NgModule({
  declarations: [
    UrlSanitizerPipe,
    ProductImagePipe,
    SlideImagePipe,
    LineaProductoImagePipe,
    TruncateTextPipe,
    NumberFormatPipe,
    UnidadMedidaPipe,
    CardBrandPipe,
    SpaceBetweenLettersPipe
  ],
  exports: [
    UrlSanitizerPipe,
    ProductImagePipe,
    SlideImagePipe,
    LineaProductoImagePipe,
    TruncateTextPipe,
    NumberFormatPipe,
    UnidadMedidaPipe,
    CardBrandPipe,
    SpaceBetweenLettersPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
