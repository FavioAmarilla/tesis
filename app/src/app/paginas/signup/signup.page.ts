import { Component, OnInit } from '@angular/core';
import { Usuario, Cliente } from '../../interfaces/interfaces';
import { UsuarioService } from '../../servicios/usuario.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/servicios/cliente.service';
import * as moment from 'moment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public cargando = false;
  public cargandoBoton = false;

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
  public repita_clave = '';

  public cliente: Cliente = {
    identificador: null,
    id_usuario: null,
    razon_social: null,
    numero_documento: null,
    celular: null,
    telefono: null
  };

  constructor(
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private servicioAlerta: AlertaService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async registro() {
    if (!this.esMayorDeEdad(this.usuario.fecha_nacimiento)) {
      this.servicioAlerta.dialogoError('Debe ser mayor de edad para registrarse');
      return;
    }

    const documento: any = await this.clienteService.documento(this.usuario.ruc);
    if (!documento.success) {
      this.servicioAlerta.dialogoError('Ya existe otro cliente con este documento');
      return;
    }

    this.cargandoBoton = true;

    // se guarda el usuario
    const response: any = await this.usuarioService.registro(this.usuario);

    this.cargandoBoton = false;
    if (response.success) {

      // se guarda el cliente
      this.cliente.id_usuario = response.data.identificador;
      this.cliente.razon_social = this.usuario.nombre_completo;
      this.cliente.numero_documento = this.usuario.ruc;
      this.cliente.celular = this.usuario.celular;
      this.cliente.telefono = this.usuario.telefono;

      const responseCliente: any = await this.clienteService.registro(this.cliente);

      if (responseCliente.success) {

        // se loguea al usuario registrado
        this.servicioAlerta.dialogoExito('Registro completado con exito');
        const login: any = await this.usuarioService.iniciarSession(this.usuario);
        if (login.success) {
          this.router.navigate(['/']);
        } else {
          this.servicioAlerta.dialogoError('Error al iniciar sesion');
        }

      } else {
        this.servicioAlerta.dialogoError(responseCliente.message);
      }

    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  esMayorDeEdad(fecha) {
    const anho = moment().diff(moment(fecha, 'YYYY-MM-DD'), 'years');

    return anho > 17;
  }


}
