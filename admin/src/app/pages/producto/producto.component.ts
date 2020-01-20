import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LineaProductoService } from '../../services/linea-producto.service';
import { TipoImpuestoService } from '../../services/tipo-impuesto.service';
import { ProductoService } from '../../services/producto.service';
import { LineaProducto } from '../../models/linea-producto';
import { Producto } from '../../models/producto';
import { TipoImpuesto } from '../../models/tipo-impuesto';
import * as JsBarcode from 'jsbarcode';
import { v4 as uuid } from 'uuid';
import swal from'sweetalert2';

const API = environment.api;

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  public url: string;
  public form = false;
  public action: string = '';
  public producto: Producto;
  public listaProductos: Producto;
  public listaImpuestos: TipoImpuesto;
  public listaLineas: LineaProducto;
  public errors = [];
  public cargando: boolean = false;

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
    private productoService: ProductoService,
    private impuestoService: TipoImpuestoService,
    private lineaProductoService: LineaProductoService
  ) { 
    this.url = environment.api;
  }

  ngOnInit() {
    this.getProductos();
    this.getImpuestos();
    this.getLineasProducto();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.producto = new Producto(null, null, null, null, null, null, null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getImpuestos() {
    var response = <any>await this.impuestoService.getImpuesto();

    if (response.status) {
      this.listaImpuestos = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  async getLineasProducto() {
    var response = <any>await this.lineaProductoService.getLinea();

    if (response.status) {
      this.listaLineas = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  async getProductos() {
    this.listaProductos = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.productoService.getProducto();

    if (response.status) {
      this.listaProductos = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getProducto(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.productoService.getProducto(id);
    
    if (response.status) {
      this.producto = response.data;
      this.viewForm(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async register() {
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.productoService.register(this.producto);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getProductos();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.viewForm(true, 'INS');
    }
  }

  async update() {
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.productoService.update(this.producto, this.producto.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getProductos();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.viewForm(true, 'UPD');
    }
  }

  uploadImage(event) {
    let data = JSON.parse(event.response);
    this.producto.archivo_img = data.data;
  }

  generateBarcode() {
    const buffer = new Array();
    const random = uuid(null, buffer, 0).join('').slice(0, 13);
    this.producto.codigo_barras = random;
    JsBarcode('#barcode', random);
  }

}
