import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { Router } from '@angular/router';
import { Usuario, Cliente } from 'src/app/interfaces/interfaces';
import { ClienteService } from 'src/app/servicios/cliente.service';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
})
export class MiCuentaPage implements OnInit {

  public cargando = true;
  public cargandoBoton = false;
  public password: any = {};
  public usuario: Usuario = {
    sub: null,
    identificador: null,
    nombre_completo: null,
    email: null,
    clave_acceso: null,
    telefono: null,
    celular: null,
    fecha_nacimiento: null,
    ruc: null
  };
  public cliente: Cliente = {
    identificador: null,
    id_usuario: null,
    razon_social: null,
    numero_documento: null,
    celular: null,
    telefono: null
  };

  constructor(
    private servicioUsuario: UsuarioService,
    private clienteService: ClienteService,
    private servicioAlerta: AlertaService,
    private router: Router
  ) {
    this.inicializar();
    this.obtenerUsuario();
  }

  ngOnInit() {
  }

  async inicializar() {
    this.password = {
      email: '',
      clave_actual: '',
      clave_nueva: '',
      repita: '',
      id: ''
    }
  }

  async obtenerUsuario() {
    let logueado: any = await this.servicioUsuario.obtenerUsuario();

    if (logueado) {
      this.usuario = logueado;

      let response: any = await this.clienteService.obtenerClienteUsuario(this.usuario.sub);
      if (response.success) {
        this.cliente = response.data;
        this.usuario.ruc = this.cliente.numero_documento;
      } else {
        this.servicioAlerta.dialogoError('Debe estar logueado');
        this.router.navigate(['/login']);
      }
    }
    this.cargando = false;
  }

  async cambiarPassword() {
    this.cargandoBoton = await true;

    let logueado: any = await this.servicioUsuario.obtenerUsuario();
    if (!logueado) {
      this.cargandoBoton = await false;
      this.servicioAlerta.dialogoError('Debe estar logueado');
      this.router.navigate(['/login']);
      return;
    }
    if (this.password.clave_nueva != this.password.repita) {
      this.cargandoBoton = await false;
      this.servicioAlerta.dialogoError('Las contraseñas no coinciden');
      return;
    }

    this.password.email = logueado.email;
    this.password.id = logueado.sub;
    this.password.clave_actual = this.usuario.clave_acceso;
    let response: any = await this.servicioUsuario.cambiarPassword(this.password);
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);

      //volver a loguear al usuario
      let loguear = {
        email: this.password.email,
        clave_acceso: this.password.clave_nueva,
      };
      let login: any = this.servicioUsuario.iniciarSession(loguear);
      this.obtenerUsuario();

    } else {
      this.cargandoBoton = await false;
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargandoBoton = await false;
  }

  async actualizarDatos() {
    this.cargandoBoton = await true;
    let response: any = await this.servicioUsuario.actualizar(this.usuario, this.usuario.sub);

    if (response.success) {

      //se guarda el cliente
      this.cliente.id_usuario = this.usuario.sub;
      this.cliente.razon_social = this.usuario.nombre_completo;
      this.cliente.numero_documento = this.usuario.ruc;
      this.cliente.celular = this.usuario.celular;
      this.cliente.telefono = this.usuario.telefono;

      const responseCliente: any = await this.clienteService.actualizar(this.cliente, this.cliente.identificador);

      if (responseCliente.success) {
        this.servicioAlerta.dialogoExito(response.message);
        //se guarda token con los nuevos datos del usuario
        this.servicioUsuario.guardarToken(response.data.token);
        //se obtiene los nuevos datos del usuario
        this.obtenerUsuario();
      } else {
        this.cargandoBoton = await false;
        this.servicioAlerta.dialogoError(responseCliente.message);
      }

    } else {
      this.cargandoBoton = await false;
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargandoBoton = await false;
  }

}
