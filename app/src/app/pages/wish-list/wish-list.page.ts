import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';
import { Producto } from '../../interfaces/interfaces';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.page.html',
  styleUrls: ['./wish-list.page.scss'],
})
export class WishListPage implements OnInit {

  public loading = true;
  public productos: Producto;

  constructor(
    private cartService: CartService,
    private alertCtrl: AlertController,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.getFavorites();
  }

  async getFavorites() {
    this.productos = await this.cartService.getFavorites();
    this.loading = false;
  }

  async confirmRemoveFromFavorites(product) {
    const alert = await this.alertCtrl.create({
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
            this.removeFromFavorites(product);
          }
        }
      ]
    });

    await alert.present();
  }


  async removeFromFavorites(product) {
    const remove = await this.cartService.removeFromFavorites(product);
    if (remove) {
      this.uiService.toast('El producto ha sido eliminado de tu lista de deseos');
      this.getFavorites();
    } else {
      this.uiService.toast('No se pudo eliminar el producto de tu lista de deseos');
    }
  }

}
