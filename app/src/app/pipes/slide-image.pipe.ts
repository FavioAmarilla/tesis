import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

const IMAGE_API = environment.host + environment.slideImageUrl;


@Pipe({
  name: 'slideImage'
})
export class SlideImagePipe implements PipeTransform {

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  transform(img: any): any {
    if (!img) return 'https://via.placeholder.com/150';

    const style = `background-image: url('${IMAGE_API}${img}');background-repeat: no-repeat;background-size: cover;`;

    return this.domSanitizer.bypassSecurityTrustStyle(style);
  }

}
