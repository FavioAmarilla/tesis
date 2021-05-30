import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ActionSheetController } from '@ionic/angular';

import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
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
  public escritorio = true;
  public password: any = {};
  public tarjetas = [];
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
    private actionSheetController: ActionSheetController,
    private servicioUsuario: UsuarioService,
    private clienteService: ClienteService,
    private servicioAlerta: AlertaService,
    private platform: Platform,
    private router: Router
  ) {
    this.inicializar();
    this.obtenerUsuario();
  }

  ionViewWillEnter() {
    this.verificarResolucion();
    this.obtenerTarjetas();
  }

  ngOnInit() {
    this.platform.resize
    .subscribe(() => {
      this.verificarResolucion();
    });
  }

  verificarResolucion() {
    const width = this.platform.width();
    this.escritorio = (width > 991) ? true : false;
  }

  async inicializar() {
    this.password = {
      email: '',
      clave_actual: '',
      clave_nueva: '',
      repita: '',
      id: ''
    };
  }

  async obtenerUsuario() {
    const logueado: any = await this.servicioUsuario.obtenerUsuario();

    if (logueado) {
      this.usuario = logueado;

      const response: any = await this.clienteService.obtenerClienteUsuario(this.usuario.identificador);
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
    this.cargandoBoton = true;

    const logueado: any = await this.servicioUsuario.obtenerUsuario();
    if (!logueado) {
      this.cargandoBoton = false;
      this.servicioAlerta.dialogoError('Debe estar logueado');
      this.router.navigate(['/login']);
      return;
    }
    if (this.password.clave_nueva != this.password.repita) {
      this.cargandoBoton = false;
      this.servicioAlerta.dialogoError('Las contraseñas no coinciden');
      return;
    }

    this.password.email = logueado.email;
    this.password.id = logueado.sub;
    this.password.clave_actual = this.usuario.clave_acceso;
    const response: any = await this.servicioUsuario.cambiarPassword(this.password);
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);

      // volver a loguear al usuario
      const loguear = {
        email: this.password.email,
        clave_acceso: this.password.clave_nueva,
      };
      const login: any = this.servicioUsuario.iniciarSession(loguear);
      this.obtenerUsuario();

    } else {
      this.cargandoBoton = false;
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargandoBoton = false;
  }

  async actualizarDatos() {
    this.cargandoBoton = true;
    const response: any = await this.servicioUsuario.actualizar(this.usuario, this.usuario.identificador);

    if (response.success) {

      // se guarda el cliente
      this.cliente.id_usuario = this.usuario.identificador;
      this.cliente.razon_social = this.usuario.nombre_completo;
      this.cliente.numero_documento = this.usuario.ruc;
      this.cliente.celular = this.usuario.celular;
      this.cliente.telefono = this.usuario.telefono;

      const responseCliente: any = await this.clienteService.actualizar(this.cliente, this.cliente.identificador);

      if (responseCliente.success) {
        this.servicioAlerta.dialogoExito(response.message);
        // se guarda token con los nuevos datos del usuario
        this.servicioUsuario.guardarToken(response.data.token);
        // se obtiene los nuevos datos del usuario
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

  async obtenerTarjetas() {
    this.cargando = false;
    const response: any = await this.servicioUsuario.obtenerTarjetas();

    if (response.success) {
      this.tarjetas = response.data;
    }

    this.cargando = false;
  }

  async opcionesTarjeta(tarjeta) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        icon: 'cancel',
        text: 'Eliminar tarjeta',
        handler: () => { this.eliminarTarjeta(tarjeta); }
      }]
    });

    await actionSheet.present();
  }

  async eliminarTarjeta(tarjeta) {
    this.cargando = false;
    const response: any = await this.servicioUsuario.eliminarTarjeta(tarjeta.card_id);

    if (response.success) {
      this.servicioAlerta.dialogoExito('Tarjeta eliminada correctamente');
      this.obtenerTarjetas();
    } else {
      this.servicioAlerta.dialogoError('No se pudo eliminar la tarjeta');
    }

    this.cargando = false;
  }

}
