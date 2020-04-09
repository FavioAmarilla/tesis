import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  constructor() { }

  dialogoExito(titulo, mensaje) {
    swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      confirmButtonColor: '#6bd098',
      confirmButtonText: 'Aceptar',
      heightAuto: false
    });
  }

  dialogoInformacion(titulo, mensaje) {
    swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'info',
      confirmButtonColor: '#6bd098',
      confirmButtonText: 'Aceptar',
      heightAuto: false
    });
  }

  dialogoError(titulo, mensaje) {
    swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      confirmButtonColor: '#6bd098',
      confirmButtonText: 'Aceptar',
      heightAuto: false
    });
  }
}
