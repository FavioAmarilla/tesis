import { Component, OnInit } from '@angular/core';
import { ServicioCarrito } from 'src/app/servicios/carrito.service';
import { Producto, Sucursal } from 'src/app/interfaces/interfaces';
import { UiService } from 'src/app/servicios/ui.service';
import { AlertController } from '@ionic/angular';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { Router } from '@angular/router';

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
    private servicioCarrito: ServicioCarrito,
    private servicioSucursal: SucursalService,
    private uiService: UiService,
    private alertaCtrl: AlertController
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
    console.log('listaCarrito:', this.listaCarrito);
  }

  async confirmarParaEliminarDelCarrito(product) {
    const alerta = await this.alertaCtrl.create({
      message: 'Deseas eliminar el producto',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {
            this.uiService.toast('Producto no eliminado');
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
      this.uiService.toast('El producto ha sido eliminado al carrito');
      this.obtenerCarrito();
    } else {
      this.uiService.toast('El producto no ha sido eliminado del carrito');
    }
  }

  async obtenerSucursalesEcommerce() {
    this.cargando = true;
    let parametros = {
      ecommerce: 'S'
    }

    const response: any = await this.servicioSucursal.obtenerSucursalesEcommerce(null, parametros);

    console.log(response);
    if (response.status) {
      this.listaSucursales = response.data;
    } else {

    }
    this.cargando = false;
  }


}
