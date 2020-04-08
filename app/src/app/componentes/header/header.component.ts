import { UsuarioService } from '../../servicios/usuario.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { AlertaService } from 'src/app/servicios/alerta.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input() cargando;
  public usuario: any = null;
  public carrito: any;

  constructor(
    private router: Router,
    private UsuarioService: UsuarioService,
    private servicioCarrito: CarritoService,
    private servicioAlerta: AlertaService
  ) {
    this.carrito = 0;
  }

  async ngOnInit() {
    this.UsuarioService.emitter
      .subscribe(
        response => {
          this.usuario = response;
        }
      );
      
    this.obtenerCantidadCarrito();
  }

  async ngOnChanges() {
    this.obtenerCantidadCarrito();
  }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  cerrarSession() {
    this.UsuarioService.cerrarSession();
    this.usuario = null;
  }

  async obtenerCantidadCarrito() {
    this.servicioCarrito.obtenerCantidad('carrito');
    this.servicioCarrito.carrito.subscribe(
      (response: any) => {
        console.log(response);
        this.carrito = response;
      },
      (error: any) => {
        this.servicioAlerta.dialogoError(error, '');
      }
    )
  }


}
