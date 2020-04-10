import { Component, OnInit } from '@angular/core';
import { TipoImpuesto } from '../../modelos/tipo-impuesto';
import { ServicioTipoImpuesto } from 'app/servicios/tipo-impuesto.service';
import swal from 'sweetalert2';
import { ServicioAlertas } from 'app/servicios/alertas.service';

@Component({
  selector: 'app-tipos-impuesto',
  templateUrl: './tipos-impuesto.component.html'
})
export class TiposImpuestoComponent implements OnInit {

  public form = false;
  public accion: string = '';
  public tipoImpuesto: TipoImpuesto;
  public listaImpuesto: TipoImpuesto;
  public cargando: boolean = false;
  public errores = [];
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private impuestoService: ServicioTipoImpuesto,
    private servicioAlerta: ServicioAlertas
  ) { }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.tipoImpuesto = new TipoImpuesto(null, null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaImpuesto = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const parametros = {
      paginar: true,
      page: this.paginaActual
    };

    const response: any = await this.impuestoService.obtenerImpuesto(null, parametros);

    if (response.success) {
      this.listaImpuesto = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerImpuesto(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errores = [];
    const response: any = await this.impuestoService.obtenerImpuesto(id);

    if (response.success) {
      this.tipoImpuesto = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errores = [];
    const response: any = await this.impuestoService.registrar(this.tipoImpuesto);

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
    const response: any = await this.impuestoService.actualizar(this.tipoImpuesto, this.tipoImpuesto.identificador);

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
