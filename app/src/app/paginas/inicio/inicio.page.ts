import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
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
import { FiltrosComponent } from 'src/app/componentes/filtros/filtros.component';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class PaginaInicio implements OnInit {

  public API: string;
  public cargando = true;

  public listaProductos: Producto;
  public listaSlides: Banner;
  public lineasProducto: LineaProducto;

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
    this.obtenerCarrusel();
  }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  async obtenerProductos(parametros?) {
    const response: any = await this.servicioProducto.obtenerProducto(null, parametros);

    if (response.success) {
      this.listaProductos = response.data;
      if (response.data.length <= 0) {
        this.listaProductos = null;
      }
    } else {
      this.cargando = false;
      this.listaProductos = null;
      this.servicioAlerta.dialogoError(response.message, '');
    }
    this.cargando = false;
  }

  async obtenerCarrusel() {
    const response: any = await this.servicioCarrusel.obtenerCarrusel();

    if (response.success) {
      this.listaSlides = response.data;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }
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
