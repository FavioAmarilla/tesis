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
  public impuestos: TipoImpuesto;
  public lineasProducto: LineaProducto;
  public errors = [];

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

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.producto = new Producto(0, 0, 0, '', '', '', 0, 0, '');
    }
  }

  getImpuestos() {
    this.impuestoService.getTipoImpuesto()
    .subscribe((response: any) => {
      if (response && response.status) {
        this.impuestos = response.data;
      }
    });
  }

  getLineasProducto() {
    this.lineaProductoService.getLineas()
    .subscribe((response: any) => {
      if (response && response.status) {
        this.lineasProducto = response.data;
      }
    })
  }

  getProductos() {
    this.productoService.getProducto().subscribe(
      (response: any) => {
        if (response && response.status) {
          this.listaProductos = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getProducto(id) {
    this.productoService.getProducto(id).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.producto = response.data;
          this.viewForm(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.errors = [];
    this.productoService.register(this.producto).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.getProductos();
          this.viewForm(true, 'INS');
        } else {
          for (const i in response.data) {
            this.errors.push(response.data[i]);
          }
        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  update() {
    console.log(this.producto);
    this.errors = [];
    this.productoService.update(this.producto, this.producto.identificador).subscribe(
      (response: any) => {
        console.log(response);
        if (response && response.status) {
          this.getProductos();
        } else {
          for (let i = 0; i < response.data.length; i++) {
            this.errors.push(response.data[i]);
          }
        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
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
