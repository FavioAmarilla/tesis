import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ServicioAlertas {

  constructor(
    private toastr: ToastrService
  ) { }

  dialogoConfirmacion(titulo, mensaje, accion, preConfirm?) {
    let confirmButtonColor = '#6bd098', confirmButtonText = 'Activar', cancelButtonColor = '#dc3545';
    if (accion === 'desactivar') {
      confirmButtonColor = '#dc3545';
      confirmButtonText = 'Desactivar';
      cancelButtonColor = '#6bd098';
    }

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
        showLoaderOnConfirm: true,
        preConfirm: async (request) => {
          if (preConfirm) {
            return await preConfirm;
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
      confirmButtonText: 'Aceptar'
    });
  }

  dialogoInformacion(titulo, mensaje) {
    swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'info',
      confirmButtonColor: '#6bd098',
      confirmButtonText: 'Aceptar'
    });
  }

  dialogoError(titulo, mensaje) {
    swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      confirmButtonColor: '#6bd098',
      confirmButtonText: 'Aceptar'
    });
  }

  toastrExito(titulo, mensaje) {
    this.toastr.success(mensaje, titulo, {
      positionClass: 'toast-top-right',
      tapToDismiss: true
    });
  }
}
