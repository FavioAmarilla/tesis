import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LineaProductoService } from '../../services/linea-producto.service';
import { TipoImpuestoService } from '../../services/tipo-impuesto.service';
import { ProductService } from '../../services/product.service';
import { LineaProducto } from '../../models/linea-producto';
import { Product } from '../../models/product';
import { TipoImpuesto } from '../../models/tipo-impuesto';
import * as JsBarcode from 'jsbarcode';
import { v4 as uuid } from 'uuid';

const API = environment.api;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public url: string;
  public form = false;
  public action: string = '';
  public product: Product;
  public products: Product;
  public taxes: TipoImpuesto;
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
    private productService: ProductService,
    private impuestoService: TipoImpuestoService,
    private lineaProductoService: LineaProductoService
  ) { }

  ngOnInit() {
    this.getProducts();
    this.getTaxes();
    this.getLineasProducto();
  }

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.product = new Product(0, 0, 0, '', '', '', 0, 0, '');
    }
  }

  getTaxes() {
    this.impuestoService.getTipoImpuesto()
    .subscribe((response: any) => {
      if (response && response.status) {
        this.taxes = response.data;
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

  getProducts() {
    this.productService.getProducts().subscribe(
      (response: any) => {
        if (response && response.status) {
          this.products = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getProduct(id) {
    this.productService.getProducts(id).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.product = response.data;

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
    this.productService.register(this.product).subscribe(
      (response: any) => {
        console.log('register: ', response, response.data.length);
        if (response && response.status) {
          this.getProducts();
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
    this.errors = [];
    this.productService.update(this.product, this.product.identificador).subscribe(
      (response: any) => {
        console.log('update: ', response);
        if (response && response.status) {
          this.getProducts();
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
    console.log(event.response);
    let data = JSON.parse(event.response);
    this.product.archivo_img = data.data;
  }

  generateBarcode() {
    const buffer = new Array();
    const random = uuid(null, buffer, 0).join('').slice(0, 13);
    this.product.codigo_barras = random;
    JsBarcode('#barcode', random);
  }

}
