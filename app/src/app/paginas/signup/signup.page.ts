import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { ServicioUsuario } from '../../servicios/usuario.service';
import { UiService } from '../../servicios/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public cargando = true;

  public usuario: Usuario = {
    identificador: 0,
    nombre_completo: '', 
    email: '', 
    clave_acceso: ''
  };

  constructor(
    private ServicioUsuario: ServicioUsuario,
    private uiService: UiService
  ) { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);
  }

  async registro() {
    this.ServicioUsuario.registro(this.usuario).subscribe(
      (response: any) => {

        if (response.status) {
          this.uiService.alerta(response.message);
        } else {
          if (response.data) {
            if (response.data.nombre_completo) {
              this.uiService.alerta(response.data.nombre_completo[0]);
              return;
            }
            if (response.data.email) {
              this.uiService.alerta(response.data.email[0]);
              return;
            }
            if (response.data.clave_acceso) {
              this.uiService.alerta(response.data.clave_acceso[0]);
              return;
            }
          } else {
            this.uiService.alerta('Error no definido');
          }
        }
      },
      error => {
        console.log('error:', error);
      }
    );
  }

}
