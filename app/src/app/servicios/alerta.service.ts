import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { CarritoService } from './carrito.service';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  constructor(
    private carritoService: CarritoService
  ) { }

  dialogoConfirmacion(titulo, mensaje, preConfirm?) {
    let confirmButtonColor = '#dc3545', confirmButtonText = 'Eliminar', cancelButtonColor = '#6bd098';

    return new Promise(resolve => { 
      swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmButtonColor,
        cancelButtonColor: cancelButtonColor,
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Cancelar',
        heightAuto: false,
        showLoaderOnConfirm: true,
        preConfirm: async (request) => {
          if (preConfirm) {
            // Importante que sea asi para que encuentre la referencia correcta del this en el servicio
            return await this[preConfirm.servicio][preConfirm.callback](preConfirm.data);
          }
          return null;
        },
        allowOutsideClick: () => !swal.isLoading()
      }).then(result => {
        resolve(result.value);
      })
    });
  }

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
