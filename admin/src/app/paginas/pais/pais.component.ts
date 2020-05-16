import { Component, OnInit } from '@angular/core';
import { Pais } from '../../modelos/pais';
import { ServicioPais } from '../../servicios/pais.service';
import swal from 'sweetalert2';
import { ServicioAlertas } from 'app/servicios/alertas.service';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.scss']
})
export class PaisComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = 'LST';
  public pais: Pais;
  public listaPaises: Pais;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioPais: ServicioPais,
    private servicioAlerta: ServicioAlertas
  ) {
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      nombre: ''
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.pais = new Pais(null, null);
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaPaises = null;
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

    const response: any = await this.servicioPais.obtener(null, this.parametros);
    if (response.success) {
      this.listaPaises = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerPais(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioPais.obtener(id);

    if (response.success) {
      this.pais = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.servicioPais.registrar(this.pais);

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
    const response: any = await this.servicioPais.actualizar(this.pais, this.pais.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
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

  async alternarEstado(pais) {
    const accion = (pais.activo == 'S') ? 'desactivar' : 'activar';
    const titulo = `¿Estas seguro de ${accion} el pais?`;
    const mensaje = '';
    const preConfirm = { servicio: 'servicioPais', callback: 'eliminar', data: pais.identificador };
    const response: any = await this.servicioAlerta.dialogoConfirmacion(titulo, mensaje, accion, preConfirm);

    if (response) {
      if (response.success) {
        this.servicioAlerta.dialogoExito(response.message, '');
        this.paginacion();
        this.mostrarFormulario(false, 'LST');
      } else {
        this.servicioAlerta.dialogoError(response.message, '');
      }
    }
  }
}
