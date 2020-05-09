import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.page.html',
  styleUrls: ['./mobile-menu.page.scss'],
})
export class MobileMenuPage implements OnInit {

  public menuItems: Observable<any>;
  public usuario;
  public logueado;

  constructor(
    private servicioGeneral: GeneralService,
    private servicioUsuario: UsuarioService
  ) {
    this.verificarUsuario();
    this.menuItems = this.servicioGeneral.obtenerMenuItems();
  }

  ngOnInit() { }

  async verificarUsuario() {
    this.logueado = await this.servicioUsuario.validarToken();
    if (this.logueado) {
      this.usuario = await this.servicioUsuario.obtenerUsuario();
    }

    this.servicioUsuario.loginEmitter
    .subscribe(
      usuario => {
        this.usuario = usuario;
        this.logueado = (usuario) ? true : false;
      },
      err => {
        console.log('Error: ', err);
        this.logueado = false;
      }
    );

    this.servicioUsuario.logoutEmitter
    .subscribe(() => {
      this.usuario = null;
      this.logueado = false;
    });
  }

  logout() {
    this.servicioUsuario.cerrarSession();
  }

}
