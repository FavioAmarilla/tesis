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

  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
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
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
    this.obtenerEmpresas();
    this.obtenerPaises();
    this.obtenerCiudades();
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      id_empresa: null,
      codigo: '',
      nombre: '',
      telefono: '',
      id_ciudad: null,
      ecommerce: null,
      central: null,
    }
  }


  async mostrarFormulario(flag, accion) {
    this.accion = accion;
    this.form = flag

    if (flag && accion === 'INS') {
      this.sucursal = new Sucursal(null, null, null, null, null, null, null, null, null, null);
      console.log(this.sucursal.id_empresa);
    }
  }

  async obtenerEmpresas() {
    const response = <any>await this.servicioEmpresa.obtener();

    if (response.success) {
      this.listaEmpresas = response.data
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async obtenerPaises() {
    const response = <any>await this.servicioPais.obtener();

    if (response.success) {
      this.listaPaises = response.data
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async obtenerCiudades(id_pais?) {
    let parametros: any = {};
    if (id_pais) {
      parametros = {
        id_pais
      };
    }

    const response = <any>await this.servicioCiudad.obtener(null, parametros);

    if (response.success) {
      this.listaCiudades = response.data
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaSucursales = null;
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

    const response: any = await this.servicioSucursal.obtener(null, this.parametros);

    if (response.success) {
      this.listaSucursales = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerSucursal(id) {
    this.accion = 'LST';
    this.cargando = true;

    const response = <any>await this.servicioSucursal.obtener(id);

    if (response.success) {
      this.sucursal = response.data;
      await this.obtenerPaises();
      await this.obtenerCiudades(this.sucursal.id_pais);
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }

    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response = <any>await this.servicioSucursal.registrar(this.sucursal);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async actualizar() {
    this.cargando = true;
    const response: any = await this.servicioSucursal.actualizar(this.sucursal, this.sucursal.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message);
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

  async alternarEstado(sucursal) {
    const accion = (sucursal.activo == 'S') ? 'desactivar' : 'activar';
    const titulo = `¿Estas seguro de ${accion} la sucursal?`;
    const mensaje = '';
    const preConfirm = { servicio: 'servicioSucursal', callback: 'eliminar', data: sucursal.identificador };
    const response: any = await this.servicioAlerta.dialogoConfirmacion(titulo, mensaje, accion, preConfirm);

    if (response) {
      if (response.success) {
        this.servicioAlerta.dialogoExito(response.message);
        this.paginacion();
        this.mostrarFormulario(false, 'LST');
      } else {
        this.servicioAlerta.dialogoError(response.message);
      }
    }
  }
}
