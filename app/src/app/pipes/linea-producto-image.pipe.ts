import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

const IMAGE_API = environment.api + environment.lineaProdImageUrl;

@Pipe({
  name: 'lineaProductoImage'
})
export class LineaProductoImagePipe implements PipeTransform {

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  transform(img: any): any {
    if (!img) return 'https://via.placeholder.com/150';

    const style = `background-image: url('${IMAGE_API}${img}')`;

    return this.domSanitizer.bypassSecurityTrustStyle(style);
  }

}
