import { Component, OnInit } from '@angular/core';
import { PuntoEmision } from '../../modelos/punto-emision';
import { Sucursal } from '../../modelos/sucursal';
import { ServicioPuntoEmision } from '../../servicios/punto-emision.service';
import { ServicioSucursal } from '../../servicios/sucursal.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-puntos-emision',
  templateUrl: './puntos-emision.component.html',
  styleUrls: []
})
export class PuntosEmisionComponent implements OnInit {

  public form = false;
  public accion: string = '';
  public listaPuntosEmision: PuntoEmision;
  public listaSucursal: Sucursal;
  public puntoEmision: PuntoEmision;
  public cargando: boolean = false;
  public errors = [];
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioPuntoEmision: ServicioPuntoEmision,
    private servicioSucursal: ServicioSucursal
  ) { }

  ngOnInit() {
    this.paginacion();
    this.obtenerSucursales();
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.puntoEmision = new PuntoEmision(null, null, null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async obtenerSucursales() {
    const response: any = await this.servicioSucursal.obtenerSucursal();

    if (response.status) {
      this.listaSucursal = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaPuntosEmision = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errors = [];

    const response: any = await this.servicioPuntoEmision.paginacion(pagina);
    
    if (response.status) {
      this.listaPuntosEmision = response.data.data;
      this.porPagina = response.data.per_page;
      this.total = response.data.total;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerPuntoEmision(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioPuntoEmision.obtenerPuntoEmision(id);

    if (response.status) {
      this.puntoEmision = response.data;
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
    const response: any = await this.servicioPuntoEmision.registrar(this.puntoEmision);
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
          this.paginacion();
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
    const response: any = await this.servicioPuntoEmision.actualizar(this.puntoEmision, this.puntoEmision.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.paginacion();
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
