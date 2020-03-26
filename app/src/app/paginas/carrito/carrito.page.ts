import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { Producto, Sucursal } from 'src/app/interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { Router } from '@angular/router';
import { AlertaService } from 'src/app/servicios/alerta.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class PaginaCarrito implements OnInit {

  public cargando = true;
  public listaCarrito: Producto;
  public listaSucursales: Sucursal;

  constructor(
    private router: Router,
    private servicioCarrito: CarritoService,
    private servicioSucursal: SucursalService,
    private alertaCtrl: AlertController,
    private servicioAlerta: AlertaService
  ) {
    this.obtenerCarrito();
    this.obtenerSucursalesEcommerce();
  }

  ngOnInit() { }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  async obtenerCarrito() {
    this.listaCarrito = await this.servicioCarrito.obtenerCarrito();
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
    if (response.status) {
      this.listaSucursales = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
    this.cargando = false;
  }


}
