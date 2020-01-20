import { Component, OnInit } from '@angular/core';
import { Barrio } from '../../modelos/barrio';
import { Ciudad } from 'app/modelos/ciudad';
import { ServicioCiudad } from '../../servicios/ciudad.service';
import { ServicioBarrio } from '../../servicios/barrio.service';
import swal from'sweetalert2';

@Component({
  selector: 'app-barrio',
  templateUrl: './barrio.component.html',
  styleUrls: ['./barrio.component.scss']
})
export class BarrioComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public action: string = '';
  public barrio: Barrio;
  public listaBarrio: Barrio;
  public listaCiudad: Ciudad;
  public errors = [];

  constructor(
    private servicioBarrio: ServicioBarrio,
    private servicioCiudad: ServicioCiudad
  ) {
    this.cargando = false;
   }

  ngOnInit() {
    this.obtenerBarrios();
    this.obtenerCiudades();
  }

  mostrarFormulario(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.barrio = new Barrio(null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async obtenerCiudades() {
    const response = <any> await this.servicioCiudad.obtenerCiudad();
    if (response.status) {
      this.listaCiudad = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  async obtenerBarrios() {
    this.listaBarrio = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    const response = <any> await this.servicioBarrio.obtenerBarrio();

    if (response.status) {
      this.listaBarrio = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerBarrio(id) {
    this.action = 'LST';
    this.cargando = true;

    this.errors = [];
    const response = <any> await this.servicioBarrio.obtenerBarrio(id);

    if (response.status) {
      this.barrio = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errors = [];
    const response = <any> await this.servicioBarrio.registrar(this.barrio);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerBarrios();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'INS');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errors = [];
    const response = <any> await this.servicioBarrio.actualizar(this.barrio, this.barrio.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerBarrios();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'UPD');
    }
  }


}
