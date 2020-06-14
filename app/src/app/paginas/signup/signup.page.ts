import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../servicios/usuario.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { Router } from '@angular/router';

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
  };
  public repita_clave = '';

  constructor(
    private UsuarioService: UsuarioService,
    private servicioAlerta: AlertaService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async registro() {
    this.cargandoBoton = true;
    const response: any = await this.UsuarioService.registro(this.usuario);

    this.cargandoBoton = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.router.navigate(['/']);
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }


}
