import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceBetweenLetters'
})
export class SpaceBetweenLettersPipe implements PipeTransform {

  transform(value: any): any {
    return value.split('').join('  ');
  }

}
