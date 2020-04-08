import { UsuarioService } from '../../servicios/usuario.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() cargando;
  public usuario: any = null;

  constructor(
    private router: Router,
    private servicioUsuario: UsuarioService
  ) {
  }

  async ngOnInit() {
    this.obtenerUsuario();

    this.servicioUsuario.loginEmitter
      .subscribe(response => {
        this.usuario = response;
      });

    this.servicioUsuario.logoutEmitter
      .subscribe(event => {
        this.obtenerUsuario();
      });
  }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  async obtenerUsuario() {
    this.usuario = await this.servicioUsuario.obtenerUsuario();
  }

  cerrarSession() {
    this.servicioUsuario.cerrarSession();
    this.usuario = null;
  }


}
