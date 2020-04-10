import { Component, OnInit } from '@angular/core';
import { Sucursal } from '../../modelos/sucursal';
import { ServicioSucursal } from '../../servicios/sucursal.service';
import { ServicioEmpresa } from '../../servicios/empresa.service';
import { Empresa } from '../../modelos/empresa';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { Pais } from 'app/modelos/pais';
import { Ciudad } from 'app/modelos/ciudad';
import { ServicioPais } from 'app/servicios/pais.service';
import { ServicioCiudad } from 'app/servicios/ciudad.service';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.scss']
})
export class SucursalComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = '';

  public sucursal: Sucursal;

  public listaPaises: Pais;
  public listaCiudades: Ciudad;
  public mostrarCiudades = false;
  public listaSucursales: Sucursal;
  public listaEmpresas: Empresa;

  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioEmpresa: ServicioEmpresa,
    private servicioPais: ServicioPais,
    private servicioCiudad: ServicioCiudad,
    private servicioSucursal: ServicioSucursal,
    private servicioAlerta: ServicioAlertas
  ) {
    this.cargando = false;
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
    this.obtenerEmpresas();
  }

  async mostrarFormulario(flag, accion) {
    this.accion = accion;
    this.form = flag

    if (flag && accion === 'INS') {
      this.sucursal = new Sucursal(null, null, null, null, null, null, null, null, null, null);
    }
  }

  async obtenerEmpresas() {
    const response = <any>await this.servicioEmpresa.obtenerEmpresa();

    if (response.success) {
      this.listaEmpresas = response.data
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
  }

  async obtenerPaises() {
    const response = <any>await this.servicioPais.obtenerPais();

    if (response.success) {
      this.listaPaises = response.data
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
  }

  async obtenerCiudades(id_pais) {
    this.cargando = true;
    let parametros = {
      id_pais
    };

    const response = <any>await this.servicioCiudad.obtenerCiudad(null, parametros);

    if (response.success) {
      this.listaCiudades = response.data
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaSucursales = null;
    this.accion = 'LST';
    this.cargando = true;

    const parametros = {
      paginar: true,
      page: this.paginaActual
    };

    const response: any = await this.servicioSucursal.obtenerSucursal(null, parametros);

    if (response.success) {
      this.listaSucursales = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerSucursal(id) {
    this.accion = 'LST';
    this.cargando = true;

    const response = <any>await this.servicioSucursal.obtenerSucursal(id);

    if (response.success) {
      this.sucursal = response.data;
      await this.obtenerPaises();
      await  this.obtenerCiudades(this.sucursal.id_pais);
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }

    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response = <any>await this.servicioSucursal.registrar(this.sucursal);

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
    const response: any = await this.servicioSucursal.actualizar(this.sucursal, this.sucursal.identificador);

    console.log(response);
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
