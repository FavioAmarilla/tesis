import { Component, OnInit, ɵConsole } from '@angular/core';
import { Ciudad } from '../../models/ciudad';
import { CiudadService } from '../../services/ciudad.service';
import { PaisService } from '../../services/pais.service';
import { Pais } from 'app/models/pais';
import swal from'sweetalert2';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.scss']
})
export class CiudadComponent implements OnInit {

  
  public cargando: boolean = false;
  public form = false;
  public action: string = '';
  public ciudad: Ciudad;
  public listaCiudades: Ciudad;
  public listaPaises: Pais;
  public errors = [];

  constructor(
    private ciudadService: CiudadService,
    private paisService: PaisService
  ) {
    this.cargando = false;
   }

  ngOnInit() {
    this.getCiudades();
    this.getPaises();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.ciudad = new Ciudad(null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getPaises() {
    var response = <any>await this.paisService.getPais();
    if (response.status) {
      this.listaPaises = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  async getCiudades() {
    this.listaCiudades = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.ciudadService.getCiudad();

    if (response.status) {
      this.listaCiudades = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getCiudad(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.ciudadService.getCiudad(id);
    
    if (response.status) {
      this.ciudad = response.data;
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
    var response = <any>await this.ciudadService.register(this.ciudad);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getCiudades();
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
    var response = <any>await this.ciudadService.update(this.ciudad, this.ciudad.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getCiudades();
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
