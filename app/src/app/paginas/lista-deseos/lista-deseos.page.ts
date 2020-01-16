import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ServicioCarrito } from '../../servicios/carrito.service';
import { UiService } from '../../servicios/ui.service';
import { Producto } from '../../interfaces/interfaces';

@Component({
  selector: 'app-lista-deseos',
  templateUrl: './lista-deseos.page.html',
  styleUrls: ['./lista-deseos.page.scss'],
})
export class PaginaListaDeseos implements OnInit {

  public cargando = true;
  public productos: Producto;

  constructor(
    private servicioCarrito: ServicioCarrito,
    private alertaCtrl: AlertController,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.obtenerFavoritos();
  }

  async obtenerFavoritos() {
    this.productos = await this.servicioCarrito.obtenerFavoritos();
    this.cargando = false;
  }

  async confirmeliminarDeFavoritos(producto) {
    const alerta = await this.alertaCtrl.create({
      message: 'Deseas eliminar el producto de tu lista de deseos ?',
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
            this.eliminarDeFavoritos(producto);
          }
        }
      ]
    });

    await alerta.present();
  }


  async eliminarDeFavoritos(producto) {
    const eliminado = await this.servicioCarrito.eliminarDeFavoritos(producto);
    if (eliminado) {
      this.uiService.toast('El producto ha sido eliminado de tu lista de deseos');
      this.obtenerFavoritos();
    } else {
      this.uiService.toast('No se pudo eliminar el producto de tu lista de deseos');
    }
  }

}
