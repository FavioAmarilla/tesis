import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from './../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
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
  public loading = false;
  public token;

  constructor(
    private usuarioService: UsuarioService,
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

  async login() {
    // this.loading = true;
    // obtener token de autenticacion
    const response: any = await this.usuarioService.login(this.angForm.value);
    if (response.success) {
      this.router.navigate(['/home']);
    } else this.errorLogin(response.error);
  }

  errorLogin(response: any) {
    this.loading = false;
    if (response.data) {
      if (response.data.email) {
        this.uiService.alert(response.data.email[0]);
        return;
      }
      if (response.data.clave_acceso) {
        this.uiService.alert(response.data.clave_acceso[0]);
        return;
      }
    } else {
      this.uiService.alert(response.message);
    }

    this.localStorage.clear();
  }

}
