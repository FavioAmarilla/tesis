import { Component, OnInit } from '@angular/core';
import { Timbrado } from 'app/modelos/timbrado';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { ServicioTipoImpuesto } from 'app/servicios/tipo-impuesto.service';
import { TimbradoService } from 'app/servicios/timbrado.service';

@Component({
  selector: 'app-timbrado',
  templateUrl: './timbrado.component.html',
  styleUrls: ['./timbrado.component.scss']
})
export class TimbradoComponent implements OnInit {

  
  public cargando: boolean = false;
  public form = false;
  public accion: string = 'LST';
  public timbrado: Timbrado;
  public listaTimbrado: Timbrado;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioTimbrado: TimbradoService,
    private servicioAlerta: ServicioAlertas
  ) {
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      numero: '',
      numero_desde: '',
      numero_hasta: '',
      fecha_desde: '',
      fecha_hasta: ''
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.timbrado = new Timbrado(null, null, null, null, null, null);
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaTimbrado = null;
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

    console.log(this.parametros);

    const response: any = await this.servicioTimbrado.obtener(null, this.parametros);
    if (response.success) {
      this.listaTimbrado = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerTimbrado (id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioTimbrado.obtener(id);

    if (response.success) {
      this.timbrado = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.servicioTimbrado.registrar(this.timbrado);

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
    const response: any = await this.servicioTimbrado.actualizar(this.timbrado, this.timbrado.identificador);

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


}
