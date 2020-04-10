import { Component, OnInit } from '@angular/core';
import { PuntoEmision } from '../../modelos/punto-emision';
import { Sucursal } from '../../modelos/sucursal';
import { ServicioPuntoEmision } from '../../servicios/punto-emision.service';
import { ServicioSucursal } from '../../servicios/sucursal.service';
import swal from 'sweetalert2';
import { ServicioAlertas } from 'app/servicios/alertas.service';

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
    private servicioSucursal: ServicioSucursal,
    private servicioAlerta: ServicioAlertas
  ) { }

  ngOnInit() {
    this.paginacion(this.paginaActual);
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

    if (response.success) {
      this.listaSucursal = response.data;
    } else {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaPuntosEmision = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errors = [];

    const parametros = {
      paginar: true,
      page: this.paginaActual
    };

    const response: any = await this.servicioPuntoEmision.obtenerPuntoEmision(null, parametros);

    if (response.success) {
      this.listaPuntosEmision = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoExito(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerPuntoEmision(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioPuntoEmision.obtenerPuntoEmision(id);

    if (response.success) {
      this.puntoEmision = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioPuntoEmision.registrar(this.puntoEmision);
    console.log(response);
    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoExito(response.message, '');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioPuntoEmision.actualizar(this.puntoEmision, this.puntoEmision.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoExito(response.message, '');
    }
  }

}
