import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from '../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertaService } from 'src/app/servicios/alerta.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public usuario: Usuario;
  public cargando = true;
  public cargandoBoton = false;
  public token;


  constructor(
    private UsuarioService: UsuarioService,
    private servicioAlerta: AlertaService,
    private router: Router
  ) {
    this.usuario = {
      identificador: null,
      nombre_completo: null,
      email: null,
      clave_acceso: null
    };
    this.cargando = false;
  }

  ngOnInit() { }

  async iniciarSession() {
    this.cargandoBoton = true;
    const response: any = await this.UsuarioService.iniciarSession(this.usuario);

    this.cargandoBoton = false;
    if (response.success) {
      this.router.navigate(['/']);
    } else {
      this.cargandoBoton = false;
      this.servicioAlerta.dialogoError('Usuario y/o Contraseña no validos', '');
    }

    this.cargandoBoton = false;
  }

}
