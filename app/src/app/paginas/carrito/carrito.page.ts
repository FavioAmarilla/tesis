import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { Producto, Sucursal, EcParametro } from 'src/app/interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { Router } from '@angular/router';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { EcParametrosService } from 'src/app/servicios/ec-parametros.service';

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
  public totales: any;

  constructor(
    private router: Router,
    private servicioCarrito: CarritoService,
    private servicioSucursal: SucursalService,
    private alertaCtrl: AlertController,
    private servicioAlerta: AlertaService,
    private servicioEcParametros: EcParametrosService
  ) {
    this.inicializarTotales();
  }

  async ngOnInit() {
    await this.obtenerParametrosEcommerce();
    await this.obtenerSucursalesEcommerce();
    await this.obtenerCarrito();
  }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  async inicializarTotales() {
    this.totales = {
      subtotal: 0,
      delivery: 10000,
      descuento: 0,
      total: 0
    }
  }

  async obtenerCarrito() {
    let carrito = await this.servicioCarrito.obtenerCarrito();
    this.listaCarrito = carrito;

    //obtener sub total
    await carrito.forEach(element => {
      this.totales.subtotal += element.precio_venta * element.cantidad;
    });

    this.cargando = false;
  }

  async confirmarParaEliminarDelCarrito(product) {
    const alerta = await this.alertaCtrl.create({
      message: 'Deseas eliminar el producto',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {
            this.servicioAlerta.dialogoError('Producto no eliminado', '');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.eliminarDelCarrito(product);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarDelCarrito(product) {
    const eliminado = await this.servicioCarrito.eliminarDelCarrito(product);
    if (eliminado) {
      this.servicioAlerta.dialogoExito('El producto ha sido eliminado al carrito', '');
      this.obtenerCarrito();
    } else {
      this.servicioAlerta.dialogoError('El producto no ha sido eliminado del carrito', '');
    }
  }

  async obtenerSucursalesEcommerce() {
    this.cargando = true;
    let parametros = {
      ecommerce: 'S'
    }

    const response: any = await this.servicioSucursal.obtenerSucursalesEcommerce(null, parametros);
    if (response.success) {
      this.listaSucursales = response.data;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async obtenerParametrosEcommerce() {
    const response: any = await this.servicioEcParametros.obtenerParametros();

    if (response.status) {
      this.parametros = response.data;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async checkout() {
    if (this.totales.subtotal < this.parametros.monto_minimo) {
      this.servicioAlerta.dialogoError('El monto de compra debe ser mayor a: ' + this.parametros.monto_minimo, '');
    }else{
      this.redireccionar('/checkout');
    }
  }


}
