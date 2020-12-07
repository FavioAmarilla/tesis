import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { EcParametrosService } from 'src/app/servicios/ec-parametros.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { AlertaService } from 'src/app/servicios/alerta.service';

import { Producto, Sucursal, EcParametro, CuponDescuento } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class PaginaCarrito implements OnInit {

  public cargando = true;
  public listaCarrito: Producto[] = [];
  public listaSucursales: Sucursal;

  public parametros: EcParametro;
  public cantidad: number = 1;
  public minimo = 1;
  public valor = 1;
  public submitCuponDescuento = false;
  public cuponDescuento: CuponDescuento = {
    identificador: 0,
    descripcion: 0,
    codigo: '',
    porc_descuento: 0,
    fecha_desde: '',
    fecha_hasta: '',
    usado: ''
  };
  public totales: any = {
    subtotal: 0,
    descuento: 0,
    total: 0
  };

  constructor(
    private router: Router,
    private platform: Platform,
    private servicioCarrito: CarritoService,
    private servicioUsuario: UsuarioService,
    private servicioSucursal: SucursalService,
    private alertaCtrl: AlertController,
    private servicioAlerta: AlertaService,
    private servicioEcParametros: EcParametrosService,
    private servicioGeneral: GeneralService
  ) { }

  async ngOnInit() {
    this.platform.resize
    .subscribe(() => {
      this.servicioGeneral.resetContainerPosition('.cart-total');
    });
  }

  async ionViewWillEnter() {
    await this.obtenerParametrosEcommerce();
    await this.obtenerSucursalesEcommerce();
    await this.obtenerCarrito();
  }

  onScroll(event: CustomEvent) {
    this.servicioGeneral.translateContainer(event, '.cart-list', '.cart-total');
  }

  async obtenerCarrito() {
    const carrito = await this.servicioCarrito.obtenerCarrito();
    this.listaCarrito = carrito;

    this.actualizarTotal();

    this.cargando = false;
  }

  actualizarTotal() {
    // obtener total
    this.totales.total = 0;
    this.totales.subtotal = 0;
    this.listaCarrito.forEach(element => {
      this.totales.subtotal += element.precio_venta * element.cantidad;
    });
    this.totales.total = this.totales.subtotal - this.totales.descuento;
  }

  async confirmarParaEliminarDelCarrito(product) {
    const preConfirm = { servicio: 'carritoService', callback: 'eliminarDelCarrito', data: product };
    const titulo = '¿Estas seguro?';
    const mensaje = 'El producto se eliminara del carrito';
    const response: any = await this.servicioAlerta.dialogoConfirmacion(titulo, mensaje, preConfirm);

    if (!response) {
      this.servicioAlerta.dialogoError(response.message);
    }
    this.obtenerCarrito();
  }

  async obtenerSucursalesEcommerce() {
    this.cargando = true;
    const parametros = {
      ecommerce: 'S'
    };

    const response: any = await this.servicioSucursal.obtenerSucursal(null, parametros);
    if (response.success) {
      this.listaSucursales = response.data;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async obtenerParametrosEcommerce() {
    const response: any = await this.servicioEcParametros.obtenerParametros();

    if (response.success) {
      this.parametros = response.data;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async pedido() {
    // validar que usuario este logueado
    const usuario: any = await this.servicioUsuario.obtenerUsuario();
    if (!usuario) {
      this.router.navigate(['/login'], {queryParams: { redirect: 'pedido'}});
      return;
    }

    // validar monto minimo de compra
    if (this.totales.total < this.parametros.monto_minimo) {
      this.servicioAlerta.dialogoError('El monto de compra debe ser mayor a: ' + this.parametros.monto_minimo);
      return;
    }

    this.router.navigate(['/pedido']);
  }

  asignarCantidad(inputCantidad, accion, producto) {
    const config: any = this.servicioGeneral.unidadMedida(producto.vr_unidad_medida, 'ambos');
    inputCantidad.setAttribute('min', config.minimo);
    this.valor = config.valor;
    this.minimo = config.minimo;
    if (accion == 'DI') {
      producto.cantidad = (producto.cantidad > this.minimo) ? producto.cantidad - this.valor : this.minimo;
    }
    if (accion == 'AU') {
      producto.cantidad += this.valor;
    }

    this.servicioCarrito.agregarAlCarrito(producto, 'upd');
    this.actualizarTotal();
  }

  ionViewWillLeave() {
    this.servicioGeneral.resetContainerPosition('.cart-total');
  }
}
