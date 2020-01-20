import { ServicioUsuario } from '../../servicios/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioCarrito } from 'src/app/servicios/carrito.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public usuario: any = null;

  constructor(
    private router: Router,
    private servicioUsuario: ServicioUsuario,
    private servicioCarrito: ServicioCarrito
  ) {
  }

  async ngOnInit() {
    this.servicioUsuario.emitter
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
    this.servicioUsuario.cerrarSession();
    this.usuario = null;
  }


}