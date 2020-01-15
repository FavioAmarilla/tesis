import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public loading = true;

  public usuario: Usuario = {
    identificador: 0,
    nombre_completo: '', 
    email: '', 
    clave_acceso: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.loading = false;
    }, 2000);
  }

  async registro() {
    this.usuarioService.registro(this.usuario).subscribe(
      (response: any) => {

        if (response.status) {
          this.uiService.alert(response.message);
        } else {
          if (response.data) {
            if (response.data.nombre_completo) {
              this.uiService.alert(response.data.nombre_completo[0]);
              return;
            }
            if (response.data.email) {
              this.uiService.alert(response.data.email[0]);
              return;
            }
            if (response.data.clave_acceso) {
              this.uiService.alert(response.data.clave_acceso[0]);
              return;
            }
          } else {
            this.uiService.alert('Error no definido');
          }
        }
      },
      error => {
        console.log('error:', error);
      }
    );
  }

}
