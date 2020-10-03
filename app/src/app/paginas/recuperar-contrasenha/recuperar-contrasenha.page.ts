import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertaService } from 'src/app/servicios/alerta.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-recuperar-contrasenha',
  templateUrl: './recuperar-contrasenha.page.html',
  styleUrls: ['./recuperar-contrasenha.page.scss'],
})
export class RecuperarContrasenhaPage implements OnInit {

  token = null;
  cargando = false;
  tokenValido = false;
  angForm: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private servicioAlerta: AlertaService,
    private servicioUsuario: UsuarioService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      if (params.token) {
        this.token = params.token;
        this.createChangePasswordForm();
        this.buscarTokenContrasenha();
      } else { this.createForm(); }
    });
  }

  ngOnInit() { }

  createForm() {
    this.angForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  createChangePasswordForm() {
    this.angForm = this.formBuilder.group({
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      token: [this.token, Validators.required]
    });
  }

  async buscarTokenContrasenha() {
    this.cargando = true;
    const response: any = await this.servicioUsuario.buscarTokenContrasenha(this.token);
    if (response.success) {
      this.tokenValido = true;
    }
    this.cargando = false;
  }

  async onSubmit() {
    this.cargando = true;

    const response: any = await this.servicioUsuario.recuperarContrasenha(this.angForm.value);
    if (response.success) {
      this.servicioAlerta.dialogoExito('Se ha enviado el email con el enlace de recuperación');
      this.router.navigate(['/login']);
    } else {
      this.servicioAlerta.dialogoError('No se ha encontrado ningún usuario con este e-mail');
    }

    this.cargando = false;
  }

  async reestablecerContrasenha() {
    this.cargando = true;

    if (this.angForm.value.password != this.angForm.value.password_confirmation) {
      this.servicioAlerta.dialogoError('Las contraseñas no coinciden');
    } else {
      const response: any = await this.servicioUsuario.reestablecerContrasenha(this.angForm.value);
      if (response.success) {
        this.servicioAlerta.dialogoExito('Contraseña reestablecida correctamente');
        this.router.navigate(['/login']);
      } else {
        this.servicioAlerta.dialogoError(response.message);
      }
    }


    this.cargando = false;
  }

}
