import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private storage: Storage
  ) { }

  private set(key, data) {
    this.storage.set(key, data);
  }

  // ---------------------------------------------
  // OBTENER CANTIDAD DE ITEMS DE CART Y FAVORITES
  // ---------------------------------------------

  async getQuantity(key) {
    const products = await this.storage.get(key) || [];
    return products.length;
  }

  // ---------
  // CART
  // ---------

  async getCart() {
    const products = await this.storage.get('cart') || [];
    return products;
  }

  addToCart(product) {
    return new Promise(async resolve => {
      const products = await this.getCart() || [];
      const exist = products.find(element => element.identificador == product.identificador );
      if (exist) {
        exist.cantidad += product.cantidad;
      } else {
        products.push(product);
      }
      this.set('cart', products);
      resolve(true);
    });
  }

  async getArrayIndex(products, product) {
    const index = await products.findIndex(
      (element, pos) => { if (element.identificador == product.identificador) return pos }
    );
    return index;
  }

  removeFromCart(product) {
    return new Promise(async resolve => {
      const products = await this.getCart() || [];
      const exist = products.find(element => element.identificador == product.identificador );
      if (exist) {
        const index = await this.getArrayIndex(products, product);
        products.splice(index, 1);
        this.set('cart', products);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  // ---------
  // FAVORITOS
  // ---------

  async getFavorites() {
    const products = await this.storage.get('favorite') || [];
    return products;
  }

  addToFavorite(product) {
    return new Promise(async resolve => {
      const products = await this.getFavorites() || [];
      const exist = products.find(element => element.identificador == product.identificador );
      if (exist) {
        exist.cantidad += product.cantidad;
      } else {
        products.push(product);
      }
      this.set('favorite', products);
      resolve(true);
    });
  }

  removeFromFavorites(product) {
    return new Promise(async resolve => {
      const favorites = await this.getFavorites() || [];
      const exist = favorites.find(element => element.identificador == product.identificador);
      if (exist) {
        const index = await this.getArrayIndex(favorites, product);
        favorites.splice(index, 1);
        this.set('favorite', favorites);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

}
