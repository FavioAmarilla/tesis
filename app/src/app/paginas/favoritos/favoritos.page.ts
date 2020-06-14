import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CarritoService } from '../../servicios/carrito.service';
import { Producto } from '../../interfaces/interfaces';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  public cargando = true;
  public productos: Producto;
  public total: any = 0;

  constructor(
    private servicioCarrito: CarritoService,
    private alertaCtrl: AlertController,
    private servicioGeneral: GeneralService,
    private servicioAlerta: AlertaService
  ) {
  }

  async ngOnInit() {
    await this.obtenerFavoritos();
  }

  async obtenerFavoritos() {
    this.productos = await this.servicioCarrito.obtenerFavoritos();
    this.cargando = false;
  }

  async confirmEliminarDeFavoritos(producto) {
    const preConfirm = { servicio: 'carritoService', callback: 'eliminarDeFavoritos', data: producto };
    const titulo = '¿Estas seguro?';
    const mensaje = 'El producto se eliminara de sus favoritos';
    const response: any = await this.servicioAlerta.dialogoConfirmacion(titulo, mensaje, preConfirm);

    console.log(response);

    if (!response) {
      this.servicioAlerta.dialogoError(response.message);
    }
    this.obtenerFavoritos();

  }


  async agregarAlCarrito(producto: any) {
    producto.cantidad = this.servicioGeneral.unidadMedida(producto.vr_unidad_medida, 'medida');
    const add = this.servicioCarrito.agregarAlCarrito(producto);

    if (add) this.servicioAlerta.dialogoExito('El producto ha sido añadido al carrito');
    else this.servicioAlerta.dialogoError('No se pudo añadir el producto al carrito');
  }

}
