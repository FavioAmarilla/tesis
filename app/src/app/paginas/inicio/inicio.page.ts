import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../servicios/producto.service';
import { Producto, Banner, LineaProducto } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { CarruselService } from 'src/app/servicios/carrusel.service';
import { environment } from '../../../environments/environment';
import { LineasProductoService } from 'src/app/servicios/linea-producto.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { IonSlides } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { AlertaService } from 'src/app/servicios/alerta.service';

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
    private servicioCarrito: CarritoService,
    private servicioProducto: ProductoService,
    private servicioCarrusel: CarruselService,
    private servicioGeneral: GeneralService,
    private servicioAlerta: AlertaService,
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
      this.servicioAlerta.dialogoError(response.message, '');
    }
    this.cargandoProducto = false;
  }

  async obtenerCarrusel() {
    this.cargandoSlide = true;
    const response: any = await this.servicioCarrusel.obtenerCarrusel();

    if (response.status) {
      this.slides = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
    this.cargandoSlide = false;
  }

  async agregarAlCarrito(producto: any) {
    producto.cantidad = this.servicioGeneral.unidadMedida(producto.vr_unidad_medida, 'medida');
    const add = this.servicioCarrito.agregarAlCarrito(producto);

    if (add) this.servicioAlerta.dialogoExito('El producto ha sido añadido al carrito', '');
    else this.servicioAlerta.dialogoError('No se pudo añadir el producto al carrito', '');
  }

  async agregarAFavoritos(producto: any) {
    producto.cantidad = this.servicioGeneral.unidadMedida(producto.vr_unidad_medida, 'medida');
    const add = this.servicioCarrito.agregarAFavoritos(producto);

    if (add) this.servicioAlerta.dialogoExito('El producto ha sido añadido sus favoritos', '');
    else this.servicioAlerta.dialogoError('No se pudo añadir el producto sus favoritos', '');
  }

}
