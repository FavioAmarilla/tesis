import { Component, OnInit } from '@angular/core';
import { TipoImpuesto } from '../../models/tipo-impuesto';
import { TipoImpuestoService } from 'app/services/tipo-impuesto.service';
import swal from'sweetalert2';

@Component({
  selector: 'app-tipos-impuesto',
  templateUrl: './tipos-impuesto.component.html'
})
export class TiposImpuestoComponent implements OnInit {

  public form = false;
  public action: string = '';
  public tipoImpuesto: TipoImpuesto;
  public listaImpuesto: TipoImpuesto;
  public cargando: boolean = false;
  public errors = [];

  constructor(
    private impuestoService: TipoImpuestoService
  ) { }

  ngOnInit() {
    this.getImpuestos();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.tipoImpuesto = new TipoImpuesto(null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getImpuestos() {
    this.listaImpuesto = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.impuestoService.getImpuesto();
    
    if (response.status) {
      this.listaImpuesto = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getImpuesto(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.impuestoService.getImpuesto(id);
    
    if (response.status) {
      this.tipoImpuesto = response.data;
      this.viewForm(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async register() {
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.impuestoService.register(this.tipoImpuesto);
    
    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getImpuestos();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.viewForm(true, 'INS');
    }
  }

  async update() {
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.impuestoService.update(this.tipoImpuesto, this.tipoImpuesto.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getImpuestos();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.viewForm(true, 'UPD');
    }
  }

}
