import { Component, OnInit } from '@angular/core';
import { Barrio } from '../../models/barrio';
import { Ciudad } from 'app/models/ciudad';
import { CiudadService } from '../../services/ciudad.service';
import { BarrioService } from '../../services/barrio.service';
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
    private barrioService: BarrioService,
    private ciudadService: CiudadService
  ) {
    this.cargando = false;
   }

  ngOnInit() {
    this.getBarrios();
    this.getCiudades();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.barrio = new Barrio(null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getCiudades() {
    var response = <any>await this.ciudadService.getCiudad();
    if (response.status) {
      this.listaCiudad = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  async getBarrios() {
    this.listaBarrio = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.barrioService.getBarrio();

    if (response.status) {
      this.listaBarrio = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getBarrio(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.barrioService.getBarrio(id);
    
    if (response.status) {
      this.barrio = response.data;
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
    var response = <any>await this.barrioService.register(this.barrio);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getBarrios();
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
    var response = <any>await this.barrioService.update(this.barrio, this.barrio.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getBarrios();
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
