import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { ProductoService } from '../../servicios/producto.service';
import { Producto, Banner, LineaProducto, Sucursal } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { CarruselService } from 'src/app/servicios/carrusel.service';
import { environment } from '../../../environments/environment';
import { LineasProductoService } from 'src/app/servicios/linea-producto.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { IonSlides } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class PaginaInicio implements OnInit {

  public API: string;
  public cargando = true;

  public listaSucursales: Sucursal;
  public listaProductos: Producto;
  public listaSlides: Banner;
  public listaLineas: LineaProducto;
  public idLineaProducto: any = 0;
  public lineasProducto: LineaProducto;

  public buscarProductoDescripcion: string = '';

  public slideImgUrl: string;
  @ViewChild(IonSlides, { static: true }) slider: IonSlides;
  public slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 800,
    loop: true,
    autoplay: {
      delay: 3000
    }
  };

  constructor(
    private servicioCarrito: CarritoService,
    private servicioProducto: ProductoService,
    private servicioCarrusel: CarruselService,
    private servicioSucursal: SucursalService,
    private servicioLineaProd: LineasProductoService,
    private servicioGeneral: GeneralService,
    private servicioAlerta: AlertaService,
    private router: Router
  ) {
    this.API = environment.api;
    this.slideImgUrl = this.API + 'producto/getImage/';
  }

  async ngOnInit() {
    await this.obtenerCarrusel();
    await this.obtenerLineaProducto();
    await this.obtenerSucursales();
  }

  redireccionar(url) {
    this.router.navigate([url]);
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

  async obtenerLineaProducto() {
    const response: any = await this.servicioLineaProd.obtenerLinea();

    if (response.success) {
      this.listaLineas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async seleccionarLineaProducto(value) {
    this.cargando = true;

    let parametros = {
      id_linea: value
    }
    if (value <= 0) {
      delete parametros.id_linea;
    }
    this.idLineaProducto = await value;
    await this.obtenerProductos(parametros);
  }


  async obtenerSucursales() {
    const parametros = {
      ecommerce: 'S'
    };
    const response: any = await this.servicioSucursal.obtenerSucursal(null, parametros);

    if (response.success) {
      this.listaSucursales = response.data;
      const central = response.data.find(sucursal => sucursal.central == 'S');
      if (central) {
        this.seleccionarSucursal(central.identificador)
        await this.servicioCarrito.setStorage('sucursal', central.identificador);
      }
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async seleccionarSucursal(value) {
    this.cargando = true;

    let parametros = {
      id_sucursal: value
    }
    await this.servicioCarrito.setStorage('sucursal', value);
    await this.obtenerProductos(parametros);
  }



  async buscarProductoPorDescripcion() {
    if (this.buscarProductoDescripcion != '' && this.buscarProductoDescripcion != null) {
      this.cargando = true;

      let parametros = {
        descripcion: this.buscarProductoDescripcion
      }
      await this.obtenerProductos(parametros);
    }
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
