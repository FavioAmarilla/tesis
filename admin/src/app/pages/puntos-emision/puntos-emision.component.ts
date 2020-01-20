import { Component, OnInit } from '@angular/core';
import { PuntoEmision } from '../../models/punto-emision';
import { Sucursal } from '../../models/sucursal';
import { PuntoEmisionService } from '../../services/punto-emision.service';
import { SucursalService } from '../../services/sucursal.service';
import swal from'sweetalert2';

@Component({
  selector: 'app-puntos-emision',
  templateUrl: './puntos-emision.component.html',
  styleUrls: []
})
export class PuntosEmisionComponent implements OnInit {

  public form = false;
  public action: string = '';
  public listaPuntosEmision: PuntoEmision;
  public listaSucursal: Sucursal;
  public puntoEmision: PuntoEmision;
  public cargando: boolean = false;
  public errors = [];

  constructor(
    private puntoEmisionService: PuntoEmisionService,
    private sucursalService: SucursalService
  ) { }

  ngOnInit() {
    this.getPuntosEmision();
    this.getSucursales();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.puntoEmision = new PuntoEmision(null, null, null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getSucursales() {
    var response = <any>await this.sucursalService.getSucursal();

    if (response.status) {
      this.listaSucursal = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
    console.log(this.listaSucursal);
  }

  async getPuntosEmision() {
    this.listaPuntosEmision = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.puntoEmisionService.getPuntoEmision();
    
    if (response.status) {
      this.listaPuntosEmision = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getPuntoEmision(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.puntoEmisionService.getPuntoEmision(id);
    
    if (response.status) {
      this.puntoEmision = response.data;
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
    var response = <any>await this.puntoEmisionService.register(this.puntoEmision);
    console.log(response);
    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getPuntosEmision();
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
    var response = <any>await this.puntoEmisionService.update(this.puntoEmision, this.puntoEmision.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getPuntosEmision();
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
