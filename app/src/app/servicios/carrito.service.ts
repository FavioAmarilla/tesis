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

  async obtenerPosicion(productos, producto) {
    const index = await productos.findIndex(
      (elemento, pos) => { if (elemento.identificador == producto.identificador) return pos }
    );
    return index;
  }

  eliminarDelCarrito(producto) {
    return new Promise(async resolve => {
      const productos = await this.obtenerCarrito() || [];
      const existe = productos.find(elemento => elemento.identificador == producto.identificador );
      if (existe) {
        const index = await this.obtenerPosicion(productos, producto);
        productos.splice(index, 1);
        this.set('carrito', productos);
        resolve(true);
      } else {
        resolve(false);
      }
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
        favoritos.splice(index, 1);
        this.set('favorito', favoritos);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

}
