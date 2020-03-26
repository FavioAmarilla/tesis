import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  public unidadMedida(medida, tipo = 'medida') {
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

    return (tipo === 'medida') ? valor : minimo;
  }
}
