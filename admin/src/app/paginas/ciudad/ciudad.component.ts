import { Component, OnInit } from '@angular/core';
import { Ciudad } from '../../modelos/ciudad';
import { ServicioCiudad } from '../../servicios/ciudad.service';
import { ServicioPais } from '../../servicios/pais.service';
import { Pais } from '../../modelos/pais';
import { ServicioAlertas } from 'app/servicios/alertas.service';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.scss']
})
export class CiudadComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = '';
  public ciudad: Ciudad;
  public listaCiudades: Ciudad;
  public listaPaises: Pais;
  public errores = [];
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioCiudad: ServicioCiudad,
    private servicioPais: ServicioPais,
    private servicioAlerta: ServicioAlertas
  ) {
    this.cargando = false;
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
    this.obtenerPaises();
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion === 'INS') {
      this.ciudad = new Ciudad(null, null, null, [], null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async obtenerPaises() {
    const response: any = await this.servicioPais.obtener();

    if (response.success) {
      this.listaPaises = response.data
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaCiudades = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const parametros = {
      paginar: true,
      page: this.paginaActual
    };

    const response: any = await this.servicioCiudad.obtener(null, parametros);

    if (response.success) {
      this.listaCiudades = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerCiudad(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errores = [];
    const response: any = await this.servicioCiudad.obtener(id);

    if (response.success) {
      this.ciudad = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errores = [];
    const response: any = await this.servicioCiudad.registrar(this.ciudad);

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

    this.errores = [];
    const response: any = await this.servicioCiudad.actualizar(this.ciudad, this.ciudad.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  obtenerCoordenadas(coords) {
    this.ciudad.marcador = coords.marcador;
    this.ciudad.poligono = coords.poligono;
  }
}
