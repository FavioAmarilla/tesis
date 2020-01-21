import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioUsuario } from '../../servicios/usuario.service';
import { Usuario } from '../../modelos/usuario';
import swal from'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public usuario: Usuario
  public errores = [];
  public cargando: boolean = false;

  constructor(
    private servicioUsuario: ServicioUsuario,
    private router: Router
  ) {
    this.usuario = new Usuario(null, null, null, null, null);
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
      swal.fire({
        text: "Acceso Denegado",
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.usuario.email = ""
          this.usuario.clave_acceso = ""
        }
      });
    };

    this.cargando = false;
  }

}
