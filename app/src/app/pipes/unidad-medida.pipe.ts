import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unidadMedida'
})
export class UnidadMedidaPipe implements PipeTransform {

  transform(medida: any, tipo: any = 'medida'): any {
    let valor = 1;
    let minimo = 1;

    switch (medida) {
      case 'UN':
      case 'LI':
        break;
      case 'KG':
        valor = 0.25;
        minimo = 0.25;
        break;
      case 'ME':
        valor = 0.5;
        minimo = 0.5;
        break;
    }

    console.log('medida: ', medida, 'valor: ', valor, 'minimo: ', minimo);
    return (tipo === 'medida') ? valor : minimo;
  }

}
