import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { ProductoService } from '../../servicios/producto.service';
import { Producto, Banner, LineaProducto, Sucursal, Marca } from '../../interfaces/interfaces';
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
import { MarcaService } from 'src/app/servicios/marca.service';

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
  public listaMarcas: Marca;

  public buscarProductoDescripcion: string = '';

  public paginaActual = 1;
  public porPagina;
  public total;
  public sucursal = 0;

  public idsCategorias: string = "";
  public idsMarcas: string = "";
  public parametrosTabla: any = []

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

  productSlideOpts = {
    loop: true,
    slidesPerView: 6,
    allowSlidePrev: true,
    allowSlideNext: true,
    autoplay: {
      delay: 3000
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      320: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      767: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 6,
      }
    }
  };

  constructor(
    private servicioCarrito: CarritoService,
    private servicioProducto: ProductoService,
    private servicioCarrusel: CarruselService,
    private servicioSucursal: SucursalService,
    private servicioAlerta: AlertaService,
    private router: Router
  ) {
    this.API = environment.api;
    this.slideImgUrl = this.API + 'producto/getImage/';
  }

  async ngOnInit() {
    await this.obtenerCarrusel();
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
      }
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async seleccionarSucursal(value) {
    this.cargando = true;

    let key = 'sucursal';
    this.parametrosTabla.push({ key, value });
    this.sucursal = value;

    await this.servicioCarrito.setStorage('sucursal', value);
    this.obtenerProductos(null, this.parametrosTabla);
  }

  async obtenerProductos(pagina?, parametrosFiltro?) {
    this.cargando = true;

    this.paginaActual = (pagina) ? pagina : this.paginaActual;

    let parametros = {};
    parametros = {
      paginar: true,
      page: this.paginaActual
    };

    if (parametrosFiltro) {
      this.parametrosTabla.forEach(element => {
        parametros[element.key] = element.value;
      });
    }

    const response: any = await this.servicioProducto.shop(null, parametros);
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

  redirectMarca(marca) {
    this.router.navigate(['/productos'], { queryParams: { sucursal: this.sucursal, order: 'created_at', marca: marca } });
  }

}
