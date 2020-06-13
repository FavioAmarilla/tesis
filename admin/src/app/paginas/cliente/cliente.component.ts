import { Component, OnInit } from '@angular/core';
import { Cliente } from 'app/modelos/cliente';
import { environment } from 'environments/environment';
import { ClienteService } from 'app/servicios/cliente.service';
import { RolesService } from 'app/servicios/roles.service';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { Rol } from 'app/modelos/rol';
import { Usuario } from 'app/modelos/usuario';
import { ClienteUsuario } from 'app/modelos/cliente-usuario';
import { ServicioUsuario } from 'app/servicios/usuario.service';

const API = environment.api;

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  public url: string;
  public seccion: string = 'general';
  public form = false;
  public accion: string = '';
  public cliente: Cliente;
  public usuario: Usuario;
  public clienteUsuario: ClienteUsuario;
  public listaCliente: Cliente;
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
    private servicioCliente: ClienteService,
    private servicioUsuario: ServicioUsuario,
    private servicioRol: RolesService,
    private servicioAlerta: ServicioAlertas
  ) {
    this.url = environment.api;
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.obtenerRoles();
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      razon_social: '',
      numero_documento: '',
      email: '',
      celular: '',
      telefono: ''
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;
    this.seccion = 'general';

    if (flag && accion == 'INS') {
      this.cliente = new Cliente(null, null, null, null, null, null);
      this.usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null);
      this.clienteUsuario = new ClienteUsuario(null, null, null, null, null, null, null, null, null);
    }
  }

  async obtenerRoles() {
    const response = <any>await this.servicioRol.obtener();

    if (response.success) {
      this.listaRol = response.data
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaCliente = null;
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

    const response: any = await this.servicioCliente.obtener(null, this.parametros);

    if (response.success) {
      this.listaCliente = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerCliente(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioCliente.obtener(id);

    if (response.success) {
      this.cliente = response.data;
      this.usuario = response.data.usuario;

      this.clienteUsuario = new ClienteUsuario(null, null, null, null, null, null, null, null, null);
      this.clienteUsuario.nombre = this.cliente.razon_social;
      this.clienteUsuario.celular = this.cliente.celular;
      this.clienteUsuario.telefono = this.cliente.telefono;
      this.clienteUsuario.numero_documento = this.cliente.numero_documento;
      this.clienteUsuario.email = this.usuario.email;
      this.clienteUsuario.fecha_nacimiento = this.usuario.fecha_nacimiento;
      this.clienteUsuario.imagen = this.usuario.imagen;
      this.clienteUsuario.id_rol = this.usuario.id_rol;


      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    console.log(this.clienteUsuario);

    //seguarda el usuario
    this.usuario.nombre_completo = this.clienteUsuario.nombre;
    this.usuario.email = this.clienteUsuario.email;
    this.usuario.clave_acceso = 'cambiar123.';
    this.usuario.imagen = this.clienteUsuario.imagen;
    this.usuario.fecha_nacimiento = this.clienteUsuario.fecha_nacimiento;
    this.usuario.telefono = this.clienteUsuario.telefono;
    this.usuario.celular = this.clienteUsuario.celular;
    this.usuario.imagen = this.clienteUsuario.imagen;
    this.usuario.id_rol = this.clienteUsuario.id_rol;

    const responseUsuario: any = await this.servicioUsuario.registrar(this.usuario);

    if (responseUsuario.success) {
      //seguarda el cliente
      this.cliente.id_usuario = responseUsuario.data.identificador;
      this.cliente.razon_social = this.clienteUsuario.nombre;
      this.cliente.numero_documento = this.clienteUsuario.numero_documento;
      this.cliente.celular = this.clienteUsuario.celular;
      this.cliente.telefono = this.clienteUsuario.telefono;

      const responseCliente: any = await this.servicioCliente.registrar(this.cliente);

      if (responseCliente.success) {
        this.servicioAlerta.dialogoExito(responseCliente.message, '');
        this.paginacion();
        this.mostrarFormulario(false, 'LST');
      } else {
        this.servicioAlerta.dialogoError(responseCliente.message, '');
      }

    } else {
      this.servicioAlerta.dialogoError(responseUsuario.message, '');
    }
  }

  async actualizar() {
    this.cargando = true;

    //se guarda el usuario
    this.usuario.nombre_completo = this.clienteUsuario.nombre;
    this.usuario.email = this.clienteUsuario.email;
    this.usuario.clave_acceso = 'cambiar123.';
    this.usuario.imagen = this.clienteUsuario.imagen;
    this.usuario.fecha_nacimiento = this.clienteUsuario.fecha_nacimiento;
    this.usuario.telefono = this.clienteUsuario.telefono;
    this.usuario.celular = this.clienteUsuario.celular;
    this.usuario.imagen = this.clienteUsuario.imagen;
    this.usuario.id_rol = this.clienteUsuario.id_rol;

    const responseUsuario: any = await this.servicioUsuario.actualizar(this.usuario, this.usuario.identificador);
    console.log('responseUsuario', responseUsuario);

    if (responseUsuario.success) {
      //seguarda el cliente
      this.cliente.id_usuario = responseUsuario.data.usuario.identificador;
      this.cliente.razon_social = this.clienteUsuario.nombre;
      this.cliente.numero_documento = this.clienteUsuario.numero_documento;
      this.cliente.celular = this.clienteUsuario.celular;
      this.cliente.telefono = this.clienteUsuario.telefono;

      const responseCliente: any = await this.servicioCliente.actualizar(this.cliente, this.cliente.identificador);
      console.log('responseCliente', responseCliente);

      if (responseCliente.success) {
        this.servicioAlerta.dialogoExito(responseCliente.message, '');
        this.paginacion();
        this.mostrarFormulario(false, 'LST');
      } else {
        this.servicioAlerta.dialogoError(responseCliente.message, '');
      }

    } else {
      this.servicioAlerta.dialogoError(responseUsuario.message, '');
    }
  }

  subirImagen(event) {
    const data = JSON.parse(event.response);
    this.clienteUsuario.imagen = data.data;
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

  siguiente() {
    this.inicializarFiltros();

    if (this.seccion == 'general') {
      this.seccion = 'cliente';
      return;
    }
    if (this.seccion == 'cliente') {
      this.seccion = 'usuario';
      return;
    }
  }

  atras() {
    this.inicializarFiltros();

    if (this.seccion == 'usuario') {
      this.seccion = 'cliente';
      return;
    }
    if (this.seccion == 'cliente') {
      this.seccion = 'general';
      return;
    }
  }
}
