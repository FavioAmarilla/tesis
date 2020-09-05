import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number | string | any, format?: string): string {
    if (!value) { return value; }

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
