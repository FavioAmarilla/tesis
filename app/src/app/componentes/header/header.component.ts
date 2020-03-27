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
    private UsuarioService: UsuarioService
  ) {
  }

  async ngOnInit() {
    this.UsuarioService.emitter
      .subscribe(
        response => {
          this.usuario = response;
        }
      );
  }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  cerrarSession() {
    this.UsuarioService.cerrarSession();
    this.usuario = null;
  }


}
