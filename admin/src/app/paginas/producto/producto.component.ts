import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ServicioLineaProducto } from '../../servicios/linea-producto.service';
import { ServicioTipoImpuesto } from '../../servicios/tipo-impuesto.service';
import { ServicioProducto } from '../../servicios/producto.service';
import { LineaProducto } from '../../modelos/linea-producto';
import { Producto } from '../../modelos/producto';
import { TipoImpuesto } from '../../modelos/tipo-impuesto';
import * as JsBarcode from 'jsbarcode';
import { v4 as uuid } from 'uuid';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { MarcaService } from 'app/servicios/marca.service';
import { Marca } from 'app/modelos/marca';
import { ServicioSucursal } from 'app/servicios/sucursal.service';
import { Sucursal } from 'app/modelos/sucursal';

const API = environment.api;

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  public url: string;
  public form = false;
  public accion: string = '';
  public producto: Producto;
  public listaProductos: Producto;
  public listaSucursales: Sucursal;
  public listaImpuestos: TipoImpuesto;
  public listaLineas: LineaProducto;
  public listaMarcas: Marca;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public cargando: boolean = false;
  public paginaActual = 1;
  public porPagina;
  public total;

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI: {
      url: `${API}/producto/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Seleccionar imagen'
  };

  constructor(
    private servicioProducto: ServicioProducto,
    private servicioSucursal: ServicioSucursal,
    private servicioImpuesto: ServicioTipoImpuesto,
    private servicioLineaProducto: ServicioLineaProducto,
    private servicioMarca: MarcaService,
    private servicioAlerta: ServicioAlertas
  ) {
    this.url = environment.api;
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.obtenerImpuestos();
    this.obtenerLineasProducto();
    this.obtenerMarcas();
    this.obtenerSucursales();
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      nombre: ''
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.producto = new Producto(null, null, null, null, null, null, null, null, null, null);
    }
  }

  async obtenerSucursales() {
    const response: any = await this.servicioSucursal.obtener();

    if (response.success) {
      this.listaSucursales = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async obtenerImpuestos() {
    const response: any = await this.servicioImpuesto.obtener();

    if (response.success) {
      this.listaImpuestos = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async obtenerLineasProducto() {
    const response: any = await this.servicioLineaProducto.obtener();

    if (response.success) {
      this.listaLineas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async obtenerMarcas() {
    const response: any = await this.servicioMarca.obtener();

    if (response.success) {
      this.listaMarcas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaProductos = null;
    this.accion = 'LST';
    this.cargando = true;

    this.parametros = null;
    this.parametros = {
      paginar: true,
      page: this.paginaActual
    };

    if (parametrosFiltro) {
      this.parametrosTabla.forEach(element => {
        this.parametros[element.key] = element.value;
      });
    }


    const response: any = await this.servicioProducto.obtener(null, this.parametros);

    if (response.success) {
      this.listaProductos = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerProducto(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioProducto.obtener(id);

    if (response.success) {
      this.producto = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.servicioProducto.registrar(this.producto);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async actualizar() {
    this.cargando = true;
    const response: any = await this.servicioProducto.actualizar(this.producto, this.producto.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  subirImagen(event) {
    console.log(event.response);
    const data = JSON.parse(event.response);
    this.producto.imagen = data.data;
  }

  generarCodigoBarras() {
    const buffer = new Array();
    const random = uuid(null, buffer, 0).join('').slice(0, 13);
    this.producto.codigo_barras = random;
    JsBarcode('#barcode', random);
  }

  async filtrarTabla(event?) {

    if (event) {
      let key = event.target.name;
      let value = event.target.value;
      let parametros = { key, value };
      this.parametrosTabla.push(parametros);

      await this.paginacion(null, parametros);
    } else {
      await this.inicializarFiltros();
      await this.paginacion(null, null);
    }
  }

}
