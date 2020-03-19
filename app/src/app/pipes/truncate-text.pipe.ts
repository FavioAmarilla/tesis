import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, limite: number): string {
    return value.length > limite ? value.substring(0, limite) + '...' : value;
  }

}
