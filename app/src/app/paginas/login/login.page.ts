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

  angForm: FormGroup;
  public cargando = false;
  public token;

  constructor(
    private servicioUsuario: ServicioUsuario,
    private uiService: UiService,
    private formBuilder: FormBuilder,
    private localStorage: Storage,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.angForm = this.formBuilder.group({
      identificador: [0],
      email: ['', Validators.required],
      clave_acceso: ['', [Validators.required, Validators.email]]
    });
  }

  async iniciarSession() {
    // this.cargando = true;
    // obtener token de autenticacion
    const response: any = await this.servicioUsuario.iniciarSession(this.angForm.value);
    if (response.success) {
      this.router.navigate(['/inicio']);
    } else this.errorLogin(response.error);
  }

  errorLogin(response: any) {
    this.cargando = false;
    if (response.data) {
      if (response.data.email) {
        this.uiService.alerta(response.data.email[0]);
        return;
      }
      if (response.data.clave_acceso) {
        this.uiService.alerta(response.data.clave_acceso[0]);
        return;
      }
    } else {
      this.uiService.alerta(response.message);
    }

    this.localStorage.clear();
  }

}
