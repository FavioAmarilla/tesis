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
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioPuntoEmision: ServicioPuntoEmision,
    private servicioSucursal: ServicioSucursal,
    private servicioAlerta: ServicioAlertas
  ) {
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
    this.obtenerSucursales();
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      id_sucursal: null,
      nombre: '',
      vr_tipo: null
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.puntoEmision = new PuntoEmision(null, null, null, null, null);
    }
  }

  async obtenerSucursales() {
    const response: any = await this.servicioSucursal.obtener();

    if (response.success) {
      this.listaSucursal = response.data;
    } else {
      this.servicioAlerta.dialogoExito(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaPuntosEmision = null;
    this.accion = 'LST';
    this.cargando = true;

    this.parametros = null;
    this.parametros = {
      paginar: true,
      page: this.paginaActual
    };

    if (parametrosFiltro) {
      this.parametrosTabla.forEach(element => {
        this.parametros[element.key] = element.value;
      });
    }

    const response: any = await this.servicioPuntoEmision.obtener(null, this.parametros);

    if (response.success) {
      this.listaPuntosEmision = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoExito(response.message);
    }

    this.cargando = false;
  }

  async obtenerPuntoEmision(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioPuntoEmision.obtener(id);

    if (response.success) {
      this.puntoEmision = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoExito(response.message);
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.servicioPuntoEmision.registrar(this.puntoEmision);
    
    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoExito(response.message);
    }
  }

  async actualizar() {
    this.cargando = true;
    const response: any = await this.servicioPuntoEmision.actualizar(this.puntoEmision, this.puntoEmision.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoExito(response.message);
    }
  }

  async filtrarTabla(event?) {

    if (event) {
      let key = event.target.name;
      let value = event.target.value;
      let parametros = { key, value };
      this.parametrosTabla.push(parametros);

      await this.paginacion(null, parametros);
    } else {
      await this.inicializarFiltros();
      await this.paginacion(null, null);
    }
  }

}
