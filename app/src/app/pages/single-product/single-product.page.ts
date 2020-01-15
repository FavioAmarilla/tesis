import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/interfaces';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.page.html',
  styleUrls: ['./single-product.page.scss'],
})
export class SingleProductPage implements OnInit {

  public id: number;
  public loading = true;
  public producto: Producto;

  public cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private cartService: CartService,
    private uiService: UiService
  ) {
    this.route.params.subscribe(
      params => {
        this.id = + params['id'];
        this.getProducto();
      }
    );
  }

  ngOnInit() { }

  getProducto() {
    this.loading = true;

    this.productoService.getProducto(this.id).subscribe(
      (response: any) => {
        if (response.status) {
          this.loading = false;
          this.producto = response.data;
        } else {
          this.router.navigate(['/']);
        }
      },
      error => {
        console.log(error);
        this.router.navigate(['/']);
      }
    );
  }

  setCantidad(accion) {
    if (accion == 'DI') {
      this.cantidad = (this.cantidad > 1) ? this.cantidad - 1 : 1;
    }
    if (accion == 'AU') {
      this.cantidad += 1;
    }
  }

  async addToCart() {
    this.producto.cantidad = this.cantidad;
    const add = await this.cartService.addToCart(this.producto);
    
    if (add) this.uiService.toast('El producto ha sido añadido al carrito');
    else this.uiService.toast('No se pudo añadir el producto al carrito');
  }

}
