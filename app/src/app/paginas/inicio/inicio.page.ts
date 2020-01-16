import { Component, OnInit } from '@angular/core';
import { ServicioProducto } from '../../servicios/producto.service';
import { Producto, Slides, LineaProducto } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { ServicioCarrusel } from 'src/app/servicios/carrusel.service';
import { environment } from '../../../environments/environment';
import { ServicioLineasProducto } from 'src/app/servicios/linea-producto.service';
import { ServicioCarrito } from 'src/app/servicios/carrito.service';
import { UiService } from 'src/app/servicios/ui.service';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class PaginaInicio implements OnInit {

  public cargando = true;
  public productos: Producto;
  public slides: Slides;
  public lineasProducto: LineaProducto;
  public API: string;
  public slideImgUrl: string;

  constructor(
    private servicioCarrito: ServicioCarrito,
    private uiService: UiService,
    private servicioProducto: ServicioProducto,
    private servicioCarrusel: ServicioCarrusel,
    private lineaProdService: ServicioLineasProducto,
    private router: Router
  ) {
    this.API = environment.api;
    this.slideImgUrl = this.API + 'producto/getImage/';
  }

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerCarrusel();
  }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  obtenerProductos() {
    this.cargando = true;
    this.servicioProducto.obtenerProductos().subscribe(
      (response: any) => {
        if (response.status) {
          this.productos = response.data;
        }
        this.cargando = false;
      },
      error => {
        console.log(error);
        this.cargando = false;
      }
    );
  }

  obtenerCarrusel() {
    this.servicioCarrusel.obtenerCarrusel().subscribe(
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

  obtenerLineasProducto() {
    this.lineaProdService.obtenerLineas().subscribe(
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

  async agregarAlCarrito(id) {
    this.servicioProducto.obtenerProducto(id).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status) {

          const product = response.data;
          product.cantidad = 1;
          const add = this.servicioCarrito.agregarAlCarrito(product);
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

  async agregarAFavoritos(id) {
    this.servicioProducto.obtenerProducto(id).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status) {

          const product = response.data;
          product.cantidad = 1;
          const add = this.servicioCarrito.agregarAFavoritos(product);
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
