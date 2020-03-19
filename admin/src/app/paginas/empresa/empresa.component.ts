import { Component, OnInit } from '@angular/core';
import { ServicioEmpresa } from '../../servicios/empresa.service';
import { Empresa } from 'app/modelos/empresa';
import { environment } from 'environments/environment';
import swal from 'sweetalert2';
import { ServicioAlertas } from 'app/servicios/alertas.service';

const API = environment.api;

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  public cargando: boolean = false;
  public url: string;
  public form = false;
  public accion: string = '';
  public empresa: Empresa;
  public listaEmpresas: Empresa;
  public errores = [];
  public paginaActual = 1;
  public porPagina;
  public total;

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI: {
      url: `${API}/empresa/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Seleccionar'
  };

  constructor(
    private servicioEmpresa: ServicioEmpresa,
    private servicioAlerta: ServicioAlertas
  ) {
    this.url = environment.api;
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.empresa = new Empresa(null, null, null, null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaEmpresas = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    let filtros = {
      'paginar': true
    };

    const response: any = await this.servicioEmpresa.obtenerEmpresa(null, pagina, filtros);

    if (response.status) {
      this.listaEmpresas = response.data.data;
      this.porPagina = response.data.per_page;
      this.total = response.data.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerEmpresa(id) {
    this.accion = "LST";
    this.cargando = true;
    this.errores = [];
    const response = <any>await this.servicioEmpresa.obtenerEmpresa(id);

    if (response.status) {
      this.empresa = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errores = [];
    const response = <any>await this.servicioEmpresa.registrar(this.empresa);

    this.cargando = false;
    if (response.status) {
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
    const response = <any>await this.servicioEmpresa.actualizar(this.empresa, this.empresa.identificador);

    this.cargando = false;
    if (response.status) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  subirImagen(event) {
    console.log(event);
    const data = JSON.parse(event.response);
    this.empresa.imagen = data.data;
  }

}
