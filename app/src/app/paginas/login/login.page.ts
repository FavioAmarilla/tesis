import { ServicioUsuario } from 'src/app/servicios/usuario.service';
import { Usuario } from '../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/servicios/ui.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public usuario: Usuario;
  public cargando = false;
  public token;


  constructor(
    private servicioUsuario: ServicioUsuario,
    private uiService: UiService,
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
    this.cargando = true;

    const response: any = await this.servicioUsuario.iniciarSession(this.usuario);

    this.cargando = false;
    if (response.success) {
      this.router.navigate(['/inicio']);
    } else {
      this.uiService.alerta(response.error);
    }
  }

}
