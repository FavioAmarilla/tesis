import { Component, OnInit } from '@angular/core';
import { ServicioUsuario } from '../../servicios/usuario.service';
import { ServicioAlertas } from '../../servicios/alertas.service';
import { Usuario } from '../../modelos/usuario';
import { environment } from 'environments/environment';
import swal from 'sweetalert2';

const API = environment.api;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  public url: string;
  public form = false;
  public accion: string = '';
  public usuario: Usuario;
  public listaUsuario: Usuario;
  public cargando: boolean = false;
  public errores = [];
  public paginaActual = 1;
  public porPagina;
  public total;

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI:  {
      url: `${API}/user/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Seleccionar imagen'
  };

  constructor(
    private servicioUsuario: ServicioUsuario,
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
      this.usuario = new Usuario(null, null, null, null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaUsuario = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const parametros = {
      paginar: true,
      page: this.paginaActual
    };

    const response: any = await this.servicioUsuario.obtenerUsuarios(null, parametros);

    if (response.status) {
      this.listaUsuario = response.data.data;
      this.porPagina = response.data.per_page;
      this.total = response.data.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerUsuario(id) {
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];
    const response: any = await this.servicioUsuario.obtenerUsuarios(id);

    console.log(response);
    if (response.status) {
      this.usuario = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    this.errores = [];
    const response: any = await this.servicioUsuario.registrar(this.usuario);

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
    const response: any = await this.servicioUsuario.actualizar(this.usuario, this.usuario.identificador);

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
    console.log(event.response);
    const data = JSON.parse(event.response);
    this.usuario.imagen = data.data;
  }

  async activarDesactivarUsuario(id, accion) {
    const preConfirm = {servicio: 'servicioUsuario', callback: 'activarDesactivarUsuario', data: id};
    const titulo = '¿Estas seguro?';
    const mensaje = 'No podras utilizar este usuario tras realizar esta acción';
    const resultado: any = await this.servicioAlertas.dialogoConfirmacion(titulo, mensaje, accion, preConfirm);

    if (resultado.status) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion(1);
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

}
