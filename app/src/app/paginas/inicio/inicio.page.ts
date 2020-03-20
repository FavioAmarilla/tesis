import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioProducto } from '../../servicios/producto.service';
import { Producto, Banner, LineaProducto } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { ServicioCarrusel } from 'src/app/servicios/carrusel.service';
import { environment } from '../../../environments/environment';
import { ServicioLineasProducto } from 'src/app/servicios/linea-producto.service';
import { ServicioCarrito } from 'src/app/servicios/carrito.service';
import { UiService } from 'src/app/servicios/ui.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class PaginaInicio implements OnInit {

  public cargandoSlide = true;
  public cargandoProducto = true;
  public productos: Producto;
  public slides: Banner;
  public lineasProducto: LineaProducto;
  public API: string;
  public slideImgUrl: string;
  @ViewChild(IonSlides, { static: true }) slider: IonSlides;
  public slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 800,
    autoplay: {
      delay: 3000
    }
  };

  constructor(
    private servicioCarrito: ServicioCarrito,
    private uiService: UiService,
    private servicioProducto: ServicioProducto,
    private servicioCarrusel: ServicioCarrusel,
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

  async obtenerProductos() {
    this.cargandoProducto = true;
    const response: any = await this.servicioProducto.obtenerProducto();

    if (response.status) {
      this.productos = response.data;
    } else {

    }
    this.cargandoProducto = false;
  }

  async obtenerCarrusel() {
    this.cargandoSlide = true;
    const response: any = await this.servicioCarrusel.obtenerCarrusel();

    if (response.status) {
      this.slides = response.data;
    } else {

    }
    this.cargandoSlide = false;
  }

  async agregarAlCarrito(id) {
    const response: any = await this.servicioProducto.obtenerProducto(id);

    if (response.status) {
      const product = response.data;
      product.cantidad = 1;
      const add = this.servicioCarrito.agregarAlCarrito(product);
      if (add) this.uiService.toast('El producto ha sido añadido al carrito');
      else this.uiService.toast('No se pudo añadir el producto al carrito');
    } else {
      this.uiService.toast('No se pudo añadir el producto al carrito');
    }
  }

  async agregarAFavoritos(id) {
    const response: any = await this.servicioProducto.obtenerProducto(id);

    if (response.status) {
      const product = response.data;
      product.cantidad = 1;
      const add = this.servicioCarrito.agregarAFavoritos(product);
      if (add) this.uiService.toast('El producto ha sido añadido a sus favoritos');
      else this.uiService.toast('No se pudo añadir el producto a sus favoritos');
    } else {
      this.uiService.toast('No se pudo añadir el producto a sus favoritos');
    }
  }

}
