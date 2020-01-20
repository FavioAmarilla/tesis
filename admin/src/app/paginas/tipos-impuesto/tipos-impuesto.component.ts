import { Component, OnInit } from '@angular/core';
import { TipoImpuesto } from '../../modelos/tipo-impuesto';
import { ServicioTipoImpuesto } from 'app/servicios/tipo-impuesto.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-tipos-impuesto',
  templateUrl: './tipos-impuesto.component.html'
})
export class TiposImpuestoComponent implements OnInit {

  public form = false;
  public accion: string = '';
  public tipoImpuesto: TipoImpuesto;
  public listaImpuesto: TipoImpuesto;
  public cargando: boolean = false;
  public errores = [];

  constructor(
    private impuestoService: ServicioTipoImpuesto
  ) { }

  ngOnInit() {
    this.obtenerImpuestos();
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.tipoImpuesto = new TipoImpuesto(null, null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async obtenerImpuestos() {
    this.listaImpuesto = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const response = <any> await this.impuestoService.obtenerImpuesto();

    if (response.status) {
      this.listaImpuesto = response.data;
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerImpuesto(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.impuestoService.obtenerImpuesto(id);

    if (response.status) {
      this.tipoImpuesto = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.impuestoService.registrar(this.tipoImpuesto);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerImpuestos();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'INS');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.impuestoService.actualizar(this.tipoImpuesto, this.tipoImpuesto.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerImpuestos();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'UPD');
    }
  }

}
