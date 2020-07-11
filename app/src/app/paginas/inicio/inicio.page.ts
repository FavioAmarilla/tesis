import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { ProductoService } from '../../servicios/producto.service';
import { Producto, Banner, LineaProducto, Sucursal } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { CarruselService } from 'src/app/servicios/carrusel.service';
import { environment } from '../../../environments/environment';
import { LineasProductoService } from 'src/app/servicios/linea-producto.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { IonSlides, ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { LineasModalComponent } from 'src/app/componentes/lineas-modal/lineas-modal.component';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class PaginaInicio implements OnInit {

  public API: string;
  public cargando = true;

  public listaSucursales: Sucursal;
  public listaProductos: Producto[] = [];
  public listaSlides: Banner;
  public listaLineas: LineaProducto;
  public idLineaProducto: any = 0;
  public lineasProducto: LineaProducto;

  public buscarProductoDescripcion: string = '';

  public paginaActual = 1;
  public porPagina;
  public total;

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
    private modalController: ModalController,
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
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async obtenerLineaProducto() {
    const response: any = await this.servicioLineaProd.obtenerLinea();

    if (response.success) {
      this.listaLineas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async seleccionarLineaProducto(value) {
    this.cargando = true;

    const parametros = {
      id_linea: value
    };

    if (value <= 0) {
      delete parametros.id_linea;
    }
    this.idLineaProducto = await value;
    await this.obtenerProductos(null, parametros);
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
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async seleccionarSucursal(value) {
    this.cargando = true;

    const parametros = {
      id_sucursal: value
    };

    await this.servicioCarrito.setStorage('sucursal', value);
    await this.obtenerProductos(null, parametros);
  }



  async buscarProductoPorDescripcion() {
    if (this.buscarProductoDescripcion != '' && this.buscarProductoDescripcion != null) {
      this.cargando = true;

      const parametros = {
        descripcion: this.buscarProductoDescripcion
      };

      await this.obtenerProductos(null, parametros);
    }
  }

  async obtenerProductos(pagina?, parametrosFiltro?) {
    this.cargando = true;

    this.paginaActual = (pagina) ? pagina : this.paginaActual;

    let parametros: any = { paginar: true, page: this.paginaActual };

    if (parametrosFiltro) {
      for (var param in parametrosFiltro) {
        if (parametrosFiltro.hasOwnProperty(param)) {
          parametros[param] = parametrosFiltro[param];
        }
      }
    }

    console.log(parametros);

    const response: any = await this.servicioProducto.obtenerProducto(null, parametros);
    if (response.success) {
      this.listaProductos = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }


  async modalLineas() {
    const modal = await this.modalController.create({
      component: LineasModalComponent,
      componentProps: {
        listaLineas: this.listaLineas,
        idLineaProducto: this.idLineaProducto
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) { this.seleccionarLineaProducto(data.idLineaProducto); }
  }

}
