import { UsuarioService } from '../../servicios/usuario.service';
import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input() cargando;
  public usuario: any = null;
  public carrito: any;
  public mostrarMobileMenu = true;
  public sucursal: number = 0;

  constructor(
    private platform: Platform,
    private servicioUsuario: UsuarioService,
    private servicioCarrito: CarritoService,
    private servicioAlerta: AlertaService,
    private servicioSucursal: SucursalService,
    private router: Router
  ) {
    this.carrito = 0;
    this.verificarResolucion();
  }

  ngOnInit() {}

  async ngAfterViewInit() {
    console.log('ngAfterViewInit');
    await this.obtenerUsuario();
    this.servicioUsuario.loginEmitter
    .subscribe(response => {
      this.usuario = response;
    });

    this.servicioUsuario.logoutEmitter
    .subscribe(event => {
      this.obtenerUsuario();
    });

    this.platform.resize
    .subscribe(() => {
      this.verificarResolucion();
    });

    this.obtenerCantidadCarrito();
    await this.obtenerSucursales();
  }

  async ngOnChanges() {
    this.obtenerCantidadCarrito();
  }

  verificarResolucion() {
    const width = this.platform.width();
    this.mostrarMobileMenu = (width > 991) ? false : true;
  }

  async obtenerUsuario() {
    this.usuario = await this.servicioUsuario.obtenerUsuario();
  }

  cerrarSession() {
    this.servicioUsuario.cerrarSession();
    this.usuario = null;
  }

  async obtenerCantidadCarrito() {
    this.servicioCarrito.obtenerCantidad('carrito');
    this.servicioCarrito.carrito.subscribe(
      (response: any) => {
        this.carrito = response;
      },
      (error: any) => {
        this.servicioAlerta.dialogoError(error);
      }
    );
  }

  async obtenerSucursales() {
    const parametros = {
      ecommerce: 'S'
    };

    const response: any = await this.servicioSucursal.obtenerSucursal(null, parametros);

    if (response.success) {
      const central = response.data.find(sucursal => sucursal.central == 'S');
      if (central != null) {
        this.sucursal = central.identificador;
      }
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  redirectProducto() {
    this.router.navigate(['/productos'], { queryParams: { sucursal: this.sucursal, order: 'created_at' } });
  }

}
