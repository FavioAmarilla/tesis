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
import swal from 'sweetalert2';

const pagina = "Productos";

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
  public listaImpuestos: TipoImpuesto;
  public listaLineas: LineaProducto;
  public errors = [];
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
    private servicioImpuesto: ServicioTipoImpuesto,
    private servicioLineaProducto: ServicioLineaProducto
  ) {
    this.url = environment.api;
  }

  ngOnInit() {
    this.paginacion();
    this.obtenerImpuestos();
    this.obtenerLineasProducto();
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.producto = new Producto(null, null, null, null, null, null, null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async obtenerImpuestos() {
    const response = <any> await this.servicioImpuesto.obtenerImpuesto();

    if (response.status) {
      this.listaImpuestos = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  async obtenerLineasProducto() {
    const response = <any> await this.servicioLineaProducto.obtenerLinea();

    if (response.status) {
      this.listaLineas = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaProductos = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errors = [];

    const response = <any> await this.servicioProducto.paginacion(pagina);

    if (response.status) {
      this.listaProductos = response.data.data;
      this.porPagina = response.data.per_page;
      this.total = response.data.total;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerProducto(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errors = [];
    const response = <any> await this.servicioProducto.obtenerProducto(id);

    if (response.status) {
      this.producto = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errors = [];
    const response = <any> await this.servicioProducto.registrar(this.producto);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.paginacion();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'INS');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errors = [];
    const response = <any> await this.servicioProducto.actualizar(this.producto, this.producto.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.paginacion();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'UPD');
    }
  }

  subirImagen(event) {
    const data = JSON.parse(event.response);
    this.producto.archivo_img = data.data;
  }

  generarCodigoBarras() {
    const buffer = new Array();
    const random = uuid(null, buffer, 0).join('').slice(0, 13);
    this.producto.codigo_barras = random;
    JsBarcode('#barcode', random);
  }

}
