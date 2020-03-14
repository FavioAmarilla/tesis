import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { ServicioUsuario } from './usuario.service';
import { ServicioBarrio } from './barrio.service';
import { ServicioCarrusel } from './carrusel.service';
import { ServicioCiudad } from './ciudad.service';
import { ServicioEmpresa } from './empresa.service';
import { ServicioLineaProducto } from './linea-producto.service';
import { ServicioPais } from './pais.service';
import { ServicioProducto } from './producto.service';
import { ServicioPuntoEmision } from './punto-emision.service';
import { ServicioSucursal } from './sucursal.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioAlertas {

  constructor(
    private toastr: ToastrService,
    private servicioBarrio: ServicioBarrio,
    private servicioCarrusel: ServicioCarrusel,
    private servicioCiudad: ServicioCiudad,
    private servicioEmpresa: ServicioEmpresa,
    private servicioLineaProducto: ServicioLineaProducto,
    private servicioPais: ServicioPais,
    private servicioProducto: ServicioProducto,
    private servicioPuntoEmision: ServicioPuntoEmision,
    private servicioSucursal: ServicioSucursal,
    private servicioTipoImpuesto: ServicioUsuario,
    private servicioUsuario: ServicioUsuario
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
            // Importante que sea asi para que encuentre la referencia correcta del this en el servicio
            return await this[preConfirm.servicio][preConfirm.callback](preConfirm.data, accion);
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
