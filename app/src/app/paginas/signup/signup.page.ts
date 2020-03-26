import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../servicios/usuario.service';
import { AlertaService } from 'src/app/servicios/alerta.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public cargando = false;

  public usuario: Usuario = {
    identificador: 0,
    nombre_completo: '',
    email: '',
    clave_acceso: ''
  };

  constructor(
    private servicioUsuario: UsuarioService,
    private servicioAlerta: AlertaService
  ) { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);
  }

  async registro() {
    this.cargando = true;
    const response: any = await this.servicioUsuario.registro(this.usuario);

    this.cargando = false;
    if (response.status) {
      this.servicioAlerta.dialogoExito(response.message, '');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }


}
