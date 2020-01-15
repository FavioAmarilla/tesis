import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto, Slides, LineaProducto } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { SlideService } from 'src/app/services/slide.service';
import { environment } from '../../../environments/environment';
import { LineaProductoService } from 'src/app/services/linea-producto.service';
import { CartService } from 'src/app/services/cart.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public loading = true;
  public productos: Producto;
  public slides: Slides;
  public lineasProducto: LineaProducto;
  public API: string;
  public slideImgUrl: string;

  constructor(
    private cartService: CartService,
    private uiService: UiService,
    private productoService: ProductoService,
    private slideService: SlideService,
    private lineaProdService: LineaProductoService,
    private router: Router
  ) {
    this.API = environment.api;
    this.slideImgUrl = this.API + 'producto/getImage/';
  }

  ngOnInit() {
    this.getProductos();
    this.getSlides();
  }

  redirectTo(url) {
    this.router.navigate([url]);
  }

  getProductos() {
    this.loading = true;
    this.productoService.getProductos().subscribe(
      (response: any) => {
        if (response.status) {
          this.productos = response.data;
        }
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  getSlides() {
    this.slideService.getSlides().subscribe(
      (response: any) => {
        if (response.status) {
          this.slides = response.data;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getLineasProducto() {
    this.lineaProdService.getLineas().subscribe(
      (response: any) => {
        if (response.status) {
          this.lineasProducto = response.data;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  async addToCart(id) {
    this.productoService.getProducto(id).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status) {

          const product = response.data;
          product.cantidad = 1;
          const add = this.cartService.addToCart(product);
          if (add) this.uiService.toast('El producto ha sido añadido al carrito');
          else this.uiService.toast('No se pudo añadir el producto al carrito');

        } else {
          this.uiService.toast('No se pudo añadir el producto al carrito');
        }
      },
      error => {
        console.log(error);
        this.uiService.toast('No se pudo añadir el producto al carrito');
      }
    );
  }

  async addToFavorite(id) {
    this.productoService.getProducto(id).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status) {

          const product = response.data;
          product.cantidad = 1;
          const add = this.cartService.addToFavorite(product);
          if (add) this.uiService.toast('El producto ha sido añadido a sus favoritos');
          else this.uiService.toast('No se pudo añadir el producto a sus favoritos');

        } else {
          this.uiService.toast('No se pudo añadir el producto a sus favoritos');
        }
      },
      error => {
        console.log(error);
        this.uiService.toast('No se pudo añadir el producto a sus favoritos');
      }
    );
  }

}
