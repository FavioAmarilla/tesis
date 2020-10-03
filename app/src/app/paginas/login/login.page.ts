import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from '../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public usuario: Usuario;
  public cargando = false;
  public cargandoBoton = false;
  public token;

  angForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private servicioAlerta: AlertaService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() { }

  createForm() {
    this.angForm = this.formBuilder.group({
      identificador: ['', ],
      nombre_completo: ['', ],
      email: ['', Validators.required],
      clave_acceso: ['', Validators.required]
    });
  }

  async iniciarSession() {
    this.cargandoBoton = true;
    const response: any = await this.usuarioService.iniciarSession(this.angForm.value);

    if (response.success) {
      this.router.navigate(['/']);
    } else {
      this.servicioAlerta.dialogoError('Usuario y/o Contraseña no validos');
    }

    this.cargandoBoton = false;
  }

}
