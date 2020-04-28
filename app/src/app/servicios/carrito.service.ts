import { Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  @Output() carrito = new EventEmitter();
  @Output() favorito = new EventEmitter();

  constructor(
    private storage: Storage
  ) { }

  async setStorage(key, data) {
    this.storage.set(key, data);
  }

  async getStorage(key) {
    const data = await this.storage.get(key) || [];
    return data;
  }

  async removeStorage(key) {
    this.storage.remove(key);
  }

  async obtenerCantidad(key) {
    const data = await this.storage.get(key) || [];
    if (data.length > 0) {
      if (key == 'carrito') this.carrito.emit(data.length);
      if (key == 'favorito') this.favorito.emit(data.length);
    } else {
      if (key == 'carrito') this.carrito.emit(0);
      if (key == 'favorito') this.favorito.emit(0);
    }
  }

  // ---------
  // CARRITO
  // ---------

  async obtenerCarrito() {
    const productos = await this.storage.get('carrito') || [];
    return productos;
  }

  agregarAlCarrito(producto, accion = 'add') {
    return new Promise(async resolve => {
      const productos = await this.obtenerCarrito() || [];
      const existe = productos.find(elemento => elemento.identificador == producto.identificador);
      if (existe) {
        if (accion == 'add') existe.cantidad += producto.cantidad;
        else existe.cantidad = producto.cantidad;
      } else {
        productos.push(producto);
      }
      this.setStorage('carrito', productos);
      this.obtenerCantidad('carrito');
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
      const existe = productos.find(elemento => elemento.identificador == producto.identificador);
      if (existe) {
        const index = this.obtenerPosicion(productos, producto);
        if (index != -1) {
          productos.splice(index, 1);
          this.setStorage('carrito', productos);
          this.obtenerCantidad('carrito');
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
      const existe = productos.find(elemento => elemento.identificador == producto.identificador);
      if (existe) {
        existe.cantidad += producto.cantidad;
      } else {
        productos.push(producto);
      }
      this.setStorage('favorito', productos);
      this.obtenerCantidad('favorito');
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
          this.setStorage('favorito', favoritos);
          this.obtenerCantidad('favorito');
          resolve(true);
        }
      }
      resolve(false);
    });
  }

}
