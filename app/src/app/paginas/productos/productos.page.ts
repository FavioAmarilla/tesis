import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../servicios/producto.service';
import { Producto, LineaProducto, Sucursal, Marca } from '../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LineasProductoService } from 'src/app/servicios/linea-producto.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { IonSlides, ModalController } from '@ionic/angular';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { LineasModalComponent } from 'src/app/componentes/lineas-modal/lineas-modal.component';
import { MarcaService } from 'src/app/servicios/marca.service';
import { EcParametrosService } from 'src/app/servicios/ec-parametros.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  public API: string;
  public cargando = true;

  public listaSucursales: Sucursal[] = [];
  public listaProductos: any[] = [];
  public listaLineas: LineaProducto;
  public idLineaProducto: any = 0;
  public lineasProducto: LineaProducto;
  public listaMarcas: Marca;

  public buscarProductoDescripcion: string = '';

  public paginaActual = 1;
  public porPagina;
  public total;

  public params = {};
  public idsCategorias = [];
  public idsMarcas = [];
  public order = 'created_at';
  public sucursal = 0;

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
    private servicioLineaProd: LineasProductoService,
    private servicioMarca: MarcaService,
    private ecParametrosService: EcParametrosService,
    private servicioAlerta: AlertaService,
    private modalController: ModalController,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.API = environment.api;
    this.slideImgUrl = this.API + 'producto/getImage/';

    this.activatedRoute.queryParams.subscribe(
      params => {
        this.params = params;
        console.log(params);
        
        this.comprobarParametros();
      }
    );
  }

  async ngOnInit() {
    await this.obtenerSucursales();
    await this.obtenerLineaProducto();
    await this.obtenerMarca();
    this.cargando = false;
  }

  redireccionar(url) {
    this.router.navigate([url]);
  }

  comprobarParametros(pagina?) {
    let key = null;
    let value = null;
    let filtros = []

    if (this.params['sucursal']) {
      key = 'sucursal';
      value = this.params['sucursal'];
      this.seleccionarSucursal(value);

      this.sucursal = value;
      filtros.push({ key, value });
    }

    if (this.params['order']) {
      key = 'order';
      value = this.params['order'];

      this.order = value;
      filtros.push({ key, value });
    }

    if (this.params['categoria']) {
      key = 'lineas';
      value = this.params['categoria'];

      this.idsCategorias = value.split(',');
      filtros.push({ key, value });
    }

    if (this.params['marca']) {
      key = 'marcas';
      value = this.params['marca'];

      this.idsMarcas = value.split(',');
      filtros.push({ key, value });
    }

    if (this.params['descripcion']) {
      key = 'descripcion';
      value = this.params['descripcion'];

      this.buscarProductoDescripcion = value;
      filtros.push({ key, value });
    }

    this.obtenerProductos(pagina, filtros);
  }

  async obtenerLineaProducto() {
    const response: any = await this.servicioLineaProd.obtenerLinea();

    if (response.success) {
      this.listaLineas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async obtenerMarca() {
    const response: any = await this.servicioMarca.obtenerMarca();

    if (response.success) {
      this.listaMarcas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async obtenerSucursales() {
    const response: any = await this.ecParametrosService.obtenerParamsucursales();

    if (response.success) {
      response.data.forEach(element => {
        this.listaSucursales.push(element.sucursal);
      });
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async seleccionarSucursal(value, redirect?) {
    this.cargando = true;
    this.sucursal = value;
    await this.servicioCarrito.setStorage('sucursal', value);

    if (redirect) {
      this.redirect();
    }
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
      parametrosFiltro.forEach(element => {
        parametros[element.key] = element.value;
      });
    }

    const response: any = await this.servicioProducto.shop(null, parametros);
    if (response.success) {
      this.listaProductos = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }


  async modalLineas() {
    const modal = await this.modalController.create({
      component: LineasModalComponent,
      componentProps: {
        listaLineas: this.listaLineas,
        idsCategorias: this.idsCategorias,
        listaMarcas: this.listaMarcas,
        idsMarcas: this.idsMarcas,
        order: this.order,
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.idsCategorias = data.idsCategorias;
      this.idsMarcas = data.idsMarcas;
      this.order = data.order;

      this.redirect();
    }
  }

  seleccionarCategoria(id, event) {
    const add = event.target.checked;

    if (add) {
      this.idsCategorias.push(id);
    } else {
      var index = this.idsCategorias.indexOf(id.toString());
      if (index >= 0) {
        this.idsCategorias.splice(index, 1);
      }
    }

    this.redirect();
  }

  seleccionarMarca(id, event) {
    const add = event.target.checked;

    if (add) {
      this.idsMarcas.push(id)
    } else {
      var index = this.idsMarcas.indexOf(id.toString());
      if (index >= 0) {
        this.idsMarcas.splice(index, 1);
      }
    }

    this.redirect();
  }

  async ordenar(value) {
    this.order = value;
    this.redirect();
  }

  redirect() {
    let queryParams: any = {};
    this.paginaActual = 1;

    if (this.sucursal) {
      queryParams.sucursal = this.sucursal;
    }

    if (this.order) {
      queryParams.order = this.order;
    }
    if (this.buscarProductoDescripcion) {
      queryParams.descripcion = this.buscarProductoDescripcion;
    }

    if (this.idsCategorias.length > 0) {
      queryParams.categoria = this.idsCategorias.toString();
    }

    if (this.idsMarcas.length > 0) {
      queryParams.marca = this.idsMarcas.toString();
    }

    this.router.navigate(['/productos'], { queryParams });
  }

  verificarCheck(modelo, id): boolean {
    let lista: any = {};
    let index = 0;
    let check = false;

    if (modelo == 'categoria') {
      lista = this.idsCategorias || [];
      index = lista.findIndex(data => data == id);
      check = (index != -1) ? true : false;
    } else if (modelo == 'marca') {
      lista = this.idsMarcas || [];
      index = lista.findIndex(data => data == id);
      check = (index != -1) ? true : false;
    }

    return check;
  }

  buscarProducto() {
    if (this.buscarProductoDescripcion == '') {
      this.redirect();
    }
  }

  ngOnDestroy() {
    console.log('destroy');
    this.params = {};
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
    this.params = {};
    this.idsMarcas = [];
    this.idsCategorias = [];
  }
}
