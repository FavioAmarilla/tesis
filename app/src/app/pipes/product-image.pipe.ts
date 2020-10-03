import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const IMAGE_API = environment.api + environment.productImageUrl;

@Pipe({
  name: 'productImage'
})
export class ProductImagePipe implements PipeTransform {

  transform(url: any, args?: any): any {
    if (!url || url == '') return 'https://via.placeholder.com/150';

    url = `${IMAGE_API}${url}`;
    return url;
  }

}
