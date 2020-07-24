import { Component, OnInit } from '@angular/core';
import { ServicioUsuario } from '../../servicios/usuario.service';
import { ServicioAlertas } from '../../servicios/alertas.service';
import { Usuario } from '../../modelos/usuario';
import { environment } from 'environments/environment';
import swal from 'sweetalert2';
import { Rol } from 'app/modelos/rol';
import { RolesService } from 'app/servicios/roles.service';

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
  public cargando: boolean = true;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  public resetVar = false;
  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI: {
      url: `${API}/user/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Seleccionar imagen'
  };

  public listaRol: Rol;

  constructor(
    private servicioUsuario: ServicioUsuario,
    private servicioRol: RolesService,
    private servicioAlerta: ServicioAlertas
  ) {
    this.url = environment.api;
    this.inicializarFiltros();
  }

  async ngOnInit() {
    this.obtenerRoles();
    this.paginacion(this.paginaActual);
    const val = await this.servicioUsuario.validarPermiso('EMPRESA.AGREGAR');
    console.log(val);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      nombre_completo: '',
      email: '',
      id_rol: null,
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null);
    }
  }

  async obtenerRoles() {
    const response = <any>await this.servicioRol.obtener();

    if (response.success) {
      this.listaRol = response.data
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaUsuario = null;
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

    const response: any = await this.servicioUsuario.obtenerUsuarios(null, this.parametros);

    if (response.success) {
      this.listaUsuario = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerUsuario(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioUsuario.obtenerUsuarios(id);

    console.log(response);
    if (response.success) {
      this.usuario = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.servicioUsuario.registrar(this.usuario);

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
    const response: any = await this.servicioUsuario.actualizar(this.usuario, this.usuario.identificador);

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
    this.usuario.imagen = data.data;
  }

  async activarDesactivarUsuario(usuario) {
    const accion = (usuario.activo == 'S') ? 'desactivar' : 'activar';
    const preConfirm = { servicio: 'servicioUsuario', callback: 'activarDesactivarUsuario', data: usuario.identificador };
    const titulo = `¿Estas seguro de ${accion} el usuario?`;
    const mensaje = (usuario.activo == 'S') ? 'No podras utilizar este usuario tras realizar esta acción' : '';
    const response: any = await this.servicioAlerta.dialogoConfirmacion(titulo, mensaje, accion, preConfirm);

    if (response) {
      if (response.success) {
        this.servicioAlerta.dialogoExito(response.message);
        this.paginacion(1);
      } else {
        this.servicioAlerta.dialogoError(response.message);
      }
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
