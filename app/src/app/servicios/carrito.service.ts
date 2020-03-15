import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ServicioCarrito {

  constructor(
    private storage: Storage
  ) { }

  private set(key, data) {
    this.storage.set(key, data);
  }

  // ---------------------------------------------
  // OBTENER CANTIDAD DE ITEMS DEL CARRITO Y FAVORITOS
  // ---------------------------------------------

  async obtenerCantidad(key) {
    const productos = await this.storage.get(key) || [];
    return productos.length;
  }

  // ---------
  // CARRITO
  // ---------

  async obtenerCarrito() {
    const productos = await this.storage.get('carrito') || [];
    return productos;
  }

  agregarAlCarrito(producto) {
    return new Promise(async resolve => {
      const productos = await this.obtenerCarrito() || [];
      const existe = productos.find(elemento => elemento.identificador == producto.identificador );
      if (existe) {
        existe.cantidad += producto.cantidad;
      } else {
        productos.push(producto);
      }
      this.set('carrito', productos);
      resolve(true);
    });
  }

  obtenerPosicion(productos, producto) {
    const index = productos.findIndex(elemento => elemento.identificador == producto.identificador);
    return index;
  }

  eliminarDelCarrito(producto) {
    return new Promise(async resolve => {
      const productos = await this.obtenerCarrito() || [];
      const existe = productos.find(elemento => elemento.identificador == producto.identificador );
      if (existe) {
        const index = this.obtenerPosicion(productos, producto);
        if (index != -1) {
          productos.splice(index, 1);
          this.set('carrito', productos);
          return resolve(true);
        }
      }
      return resolve(false);
    });
  }

  // ---------
  // FAVORITOS
  // ---------

  async obtenerFavoritos() {
    const productos = await this.storage.get('favorito') || [];
    return productos;
  }

  agregarAFavoritos(producto) {
    return new Promise(async resolve => {
      const productos = await this.obtenerFavoritos() || [];
      const existe = productos.find(elemento => elemento.identificador == producto.identificador );
      if (existe) {
        existe.cantidad += producto.cantidad;
      } else {
        productos.push(producto);
      }
      this.set('favorito', productos);
      resolve(true);
    });
  }

  eliminarDeFavoritos(producto) {
    return new Promise(async resolve => {
      const favoritos = await this.obtenerFavoritos() || [];
      const existe = favoritos.find(elemento => elemento.identificador == producto.identificador);
      if (existe) {
        const index = await this.obtenerPosicion(favoritos, producto);
        if (index != -1) {
          favoritos.splice(index, 1);
          this.set('favorito', favoritos);
          resolve(true);
        }
      }
      resolve(false);
    });
  }

}
