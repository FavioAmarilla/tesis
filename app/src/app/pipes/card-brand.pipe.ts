import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardBrand'
})
export class CardBrandPipe implements PipeTransform {

  transform(value: any, type: string): any {
    let icon = '', iconClass = '';
    const text = value.toLowerCase();

    if (text.indexOf('mastercard') != -1) {
      icon = '/assets/icon/mastercard.svg';
      iconClass = 'mastercard';
    } else if (text.indexOf('visa') != -1) {
      icon = '/assets/icon/visa.svg';
      iconClass = 'visa';
    } else {
      icon = '/assets/icon/infonet.svg';
      iconClass = 'infonet';
    }

    return (type == 'icon') ? icon : iconClass;
  }

}
