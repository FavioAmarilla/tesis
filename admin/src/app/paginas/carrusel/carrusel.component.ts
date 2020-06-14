import { Component, OnInit } from '@angular/core';
import { ServicioCarrusel } from '../../servicios/carrusel.service';
import { Carrusel } from '../../modelos/carrusel';
import { environment } from 'environments/environment';
import swal from 'sweetalert2';
import { ServicioAlertas } from 'app/servicios/alertas.service';

const API = environment.api;

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.scss']
})
export class CarruselComponent implements OnInit {

  public url: string;
  public form = false;
  public accion: string = '';
  public slide: Carrusel;
  public listaSlide: Carrusel;
  public cargando: boolean = false;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI: {
      url: `${API}/slide/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Seleccionar imagen'
  };
  public carrusel: Carrusel;

  constructor(
    private servicioCarrusel: ServicioCarrusel,
    private servicioAlerta: ServicioAlertas
  ) {
    this.url = environment.api;
    this.inicializarFiltros()
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      titulo: null,
      descripcion: ''
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.slide = new Carrusel(null, null, null, null);
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaSlide = null;
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

    const response: any = await this.servicioCarrusel.obtener(null, this.parametros);

    if (response.success) {
      this.listaSlide = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerCarrusel(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioCarrusel.obtener(id);

    if (response.success) {
      this.slide = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.servicioCarrusel.registrar(this.slide);

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
    const response: any = await this.servicioCarrusel.actualizar(this.slide, this.slide.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async eliminar(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioCarrusel.eliminar(id);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  subirImagen(event) {
    const data = JSON.parse(event.response);
    this.slide.imagen = data.data;
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

  async alternarEstado(slider) {
    const accion = (slider.activo == 'S') ? 'desactivar' : 'activar';
    const titulo = `¿Estas seguro de ${accion} el slider?`;
    const mensaje = '';
    const preConfirm = { servicio: 'servicioCarrusel', callback: 'eliminar', data: slider.identificador };
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
