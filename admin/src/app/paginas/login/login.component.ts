import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioUsuario } from '../../servicios/usuario.service';
import { ServicioAlertas } from '../../servicios/alertas.service';
import { Usuario } from '../../modelos/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public usuario: Usuario
  public errores = [];
  public cargando = false;

  constructor(
    private servicioUsuario: ServicioUsuario,
    private servicioAlertas: ServicioAlertas,
    private router: Router
  ) {
    this.usuario = new Usuario(null, null, null, null, null, null, null, null);
    this.cargando = false;
  }

  ngOnInit() {
  }

  async iniciarSession() {
    this.cargando = true;

    this.errores = [];
    const response: any = await this.servicioUsuario.iniciarSession(this.usuario);
    if (response.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.servicioAlertas.dialogoError('Acceso Denegado', response.message);
    };

    this.cargando = false;
  }

}
