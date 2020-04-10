import { Component, OnInit } from '@angular/core';
import { Barrio } from '../../modelos/barrio';
import { Ciudad } from 'app/modelos/ciudad';
import { ServicioCiudad } from '../../servicios/ciudad.service';
import { ServicioBarrio } from '../../servicios/barrio.service';
import swal from 'sweetalert2';
import { ServicioAlertas } from 'app/servicios/alertas.service';

@Component({
  selector: 'app-barrio',
  templateUrl: './barrio.component.html',
  styleUrls: ['./barrio.component.scss']
})
export class BarrioComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = '';
  public barrio: Barrio;
  public listaBarrio: Barrio;
  public listaCiudad: Ciudad;
  public errors = [];
  public paginaActual = 1;
  public porPagina;
  public total;


  constructor(
    private servicioBarrio: ServicioBarrio,
    private servicioCiudad: ServicioCiudad,
    private servicioAlerta: ServicioAlertas
  ) {
    this.cargando = false;
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
    this.obtenerCiudades();
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.barrio = new Barrio(null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async obtenerCiudades() {
    const response: any = await this.servicioCiudad.obtenerCiudad();
    if (response.success) {
      this.listaCiudad = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaBarrio = null;
    this.accion = "LST";
    this.cargando = true;
    this.errors = [];

    const parametros = {
      paginar: true,
      page: this.paginaActual
    };

    const response: any = await this.servicioBarrio.obtenerBarrio(null, parametros);

    if (response.success) {
      this.listaBarrio = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerBarrio(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioBarrio.obtenerBarrio(id);

    if (response.success) {
      this.barrio = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioBarrio.registrar(this.barrio);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioBarrio.actualizar(this.barrio, this.barrio.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }


}
