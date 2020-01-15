import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Producto } from 'src/app/interfaces/interfaces';
import { UiService } from 'src/app/services/ui.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  public loading = true;
  public productos: Producto;

  constructor(
    private cartService: CartService,
    private uiService: UiService,
    private alertCtrl: AlertController
  ) {
    this.getCart();
  }

  ngOnInit() { }

  async getCart() {
    this.productos = await this.cartService.getCart();
    this.loading = false;
  }

  async confirmRemoveFromCart(product) {
    const alert = await this.alertCtrl.create({
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
            this.removeFromCart(product);
          }
        }
      ]
    });

    await alert.present();
  }


  async removeFromCart(product) {
    const remove = await this.cartService.removeFromCart(product);
    if (remove) {
      this.uiService.toast('El producto ha sido eliminado al carrito');
      this.getCart();
    } else {
      this.uiService.toast('El producto no ha sido eliminado del carrito');
    }
  }

}
