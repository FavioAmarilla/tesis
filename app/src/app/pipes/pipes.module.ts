import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlSanitizerPipe } from './url-sanitizer.pipe';
import { ProductImagePipe } from './product-image.pipe';
import { SlideImagePipe } from './slide-image.pipe';
import { LineaProductoImagePipe } from './linea-producto-image.pipe';
import { TruncateTextPipe } from './truncate-text.pipe';
import { NumberFormatPipe } from './number-format.pipe';

@NgModule({
  declarations: [
    UrlSanitizerPipe,
    ProductImagePipe,
    SlideImagePipe,
    LineaProductoImagePipe,
    TruncateTextPipe,
    NumberFormatPipe
  ],
  exports: [
    UrlSanitizerPipe,
    ProductImagePipe,
    SlideImagePipe,
    LineaProductoImagePipe,
    TruncateTextPipe,
    NumberFormatPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
