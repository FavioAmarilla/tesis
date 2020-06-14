import { Component, OnInit } from '@angular/core';
import { ServicioUsuario } from 'app/servicios/usuario.service';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { Usuario } from 'app/modelos/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.scss']
})
export class CambiarClaveComponent implements OnInit {

  public cargandoBoton = false;
  public password: any = {};
  public usuario: Usuario = {
    identificador: null,
    nombre_completo: null,
    email: null,
    clave_acceso: null,
    imagen: null,
    fecha_nacimiento: null,
    telefono: null,
    celular: null,
    estado: null,
    sub: null
  };

  constructor(
    private servicioUsuario: ServicioUsuario,
    private servicioAlerta: ServicioAlertas,
    private router: Router
  ) {
    this.inicializar();
    this.obtenerUsuario();
  }

  ngOnInit() {
  }

  async obtenerUsuario() {
    let logueado: any = await this.servicioUsuario.obtenerUsuario();
    if (logueado) {
      this.usuario = logueado;
    }
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
    let response: any = await this.servicioUsuario.cambiarPassword(this.password);
    console.log(response);
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

}
