import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CarritoService } from '../../servicios/carrito.service';
import { Producto } from '../../interfaces/interfaces';
import { AlertaService } from 'src/app/servicios/alerta.service';

@Component({
  selector: 'app-lista-deseos',
  templateUrl: './lista-deseos.page.html',
  styleUrls: ['./lista-deseos.page.scss'],
})
export class PaginaListaDeseos implements OnInit {

  public cargando = true;
  public productos: Producto;

  constructor(
    private servicioCarrito: CarritoService,
    private alertaCtrl: AlertController,
    private servicioAlerta: AlertaService
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
            this.servicioAlerta.dialogoError('El producto no ha sido eliminado ', '');
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
      this.servicioAlerta.dialogoExito('El producto ha sido eliminado de tu lista de deseos', '');
      this.obtenerFavoritos();
    } else {
      this.servicioAlerta.dialogoError('No se pudo eliminar el producto de tu lista de deseos', '');
    }
  }

}
