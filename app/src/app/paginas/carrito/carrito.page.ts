import { Component, OnInit } from '@angular/core';
import { ServicioCarrito } from 'src/app/servicios/carrito.service';
import { Producto } from 'src/app/interfaces/interfaces';
import { UiService } from 'src/app/servicios/ui.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class PaginaCarrito implements OnInit {

  public cargando = true;
  public productos: Producto;

  constructor(
    private servicioCarrito: ServicioCarrito,
    private uiService: UiService,
    private alertaCtrl: AlertController
  ) {
    this.obtenerCarrito();
  }

  ngOnInit() { }

  async obtenerCarrito() {
    this.productos = await this.servicioCarrito.obtenerCarrito();
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

}
