import { Component, OnInit } from '@angular/core';
import { Marca } from '../../modelos/marca';
import { MarcaService } from '../../servicios/marca.service';
import { ServicioAlertas } from 'app/servicios/alertas.service';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.scss']
})
export class MarcaComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = '';
  public marca: Marca;
  public listaMarcas: Marca;
  public errores = [];
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioMarca: MarcaService,
    private servicioAlerta: ServicioAlertas
  ) {
    this.cargando = false;
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion === 'INS') {
      this.marca = new Marca(null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaMarcas = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const parametros = {
      paginar: true,
      page: this.paginaActual
    };

    const response: any = await this.servicioMarca.obtener(null, parametros);

    if (response.success) {
      this.listaMarcas = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerMarca(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errores = [];
    const response = <any>await this.servicioMarca.obtener(id);

    if (response.success) {
      this.marca = response.data;
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
    const response = <any>await this.servicioMarca.registrar(this.marca);

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
    const response: any = await this.servicioMarca.actualizar(this.marca, this.marca.identificador);
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
