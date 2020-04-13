import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { Producto, Sucursal, EcParametro } from 'src/app/interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { Router } from '@angular/router';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { EcParametrosService } from 'src/app/servicios/ec-parametros.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class PaginaCarrito implements OnInit {

  public cargando = true;
  public listaCarrito: Producto;
  public listaSucursales: Sucursal;

  public parametros: EcParametro;
  public total: any = 0;

  constructor(
    private router: Router,
    private servicioCarrito: CarritoService,
    private servicioUsuario: UsuarioService,
    private servicioSucursal: SucursalService,
    private alertaCtrl: AlertController,
    private servicioAlerta: AlertaService,
    private servicioEcParametros: EcParametrosService
  ) { }

  async ngOnInit() {
    await this.obtenerParametrosEcommerce();
    await this.obtenerSucursalesEcommerce();
    await this.obtenerCarrito();
  }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  async obtenerCarrito() {
    const carrito = await this.servicioCarrito.obtenerCarrito();
    this.listaCarrito = carrito;

    // obtener total
    this.total = 0;
    await carrito.forEach(element => {
      this.total += element.precio_venta * element.cantidad;
    });

    this.cargando = false;
  }

  async confirmarParaEliminarDelCarrito(product) {
    const preConfirm = { servicio: 'carritoService', callback: 'eliminarDelCarrito', data: product };
    const titulo = '¿Estas seguro?';
    const mensaje = 'El producto se eliminara del carrito';
    const response: any = await this.servicioAlerta.dialogoConfirmacion(titulo, mensaje, preConfirm);

    console.log(response);

    if (!response) {
      this.servicioAlerta.dialogoError(response.message, '');
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
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async obtenerParametrosEcommerce() {
    const response: any = await this.servicioEcParametros.obtenerParametros();

    if (response.success) {
      this.parametros = response.data;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async pedido() {
    // validar que usuario este logueado
    const usuario: any = await this.servicioUsuario.obtenerUsuario();
    if (usuario.length <= 0) {
      this.servicioAlerta.dialogoError('Debe estar Logueado para confirmar la operacion', '');
      return;
    }

    // validar monto minimo de compra
    if (this.total < this.parametros.monto_minimo) {
      this.servicioAlerta.dialogoError('El monto de compra debe ser mayor a: ' + this.parametros.monto_minimo, '');
      return;
    }

    this.redireccionar('/pedido');
  }


}
