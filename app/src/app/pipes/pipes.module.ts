import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlSanitizerPipe } from './url-sanitizer.pipe';
import { ProductImagePipe } from './product-image.pipe';
import { SlideImagePipe } from './slide-image.pipe';
import { LineaProductoImagePipe } from './linea-producto-image.pipe';

@NgModule({
  declarations: [
    UrlSanitizerPipe,
    ProductImagePipe,
    SlideImagePipe,
    LineaProductoImagePipe
  ],
  exports: [
    UrlSanitizerPipe,
    ProductImagePipe,
    SlideImagePipe,
    LineaProductoImagePipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
