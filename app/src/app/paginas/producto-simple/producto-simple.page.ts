import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioProducto } from '../../servicios/producto.service';
import { Producto } from '../../interfaces/interfaces';
import { ServicioCarrito } from '../../servicios/carrito.service';
import { UiService } from '../../servicios/ui.service';

@Component({
  selector: 'app-producto-simple',
  templateUrl: './producto-simple.page.html',
  styleUrls: ['./producto-simple.page.scss'],
})
export class PaginaProductoSimple implements OnInit {

  public id: number;
  public cargando = true;
  public producto: Producto;

  public cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioProducto: ServicioProducto,
    private servicioCarrito: ServicioCarrito,
    private uiService: UiService
  ) {
    this.route.params.subscribe(
      params => {
        this.id = + params['id'];
        this.obtenerProducto();
      }
    );
  }

  ngOnInit() { }

  obtenerProducto() {
    this.cargando = true;

    this.servicioProducto.obtenerProducto(this.id).subscribe(
      (response: any) => {
        if (response.status) {
          this.cargando = false;
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

  asignarCantidad(accion) {
    if (accion == 'DI') {
      this.cantidad = (this.cantidad > 1) ? this.cantidad - 1 : 1;
    }
    if (accion == 'AU') {
      this.cantidad += 1;
    }
  }

  async agregarAlCarrito() {
    this.producto.cantidad = this.cantidad;
    const add = await this.servicioCarrito.agregarAlCarrito(this.producto);
    
    if (add) this.uiService.toast('El producto ha sido añadido al carrito');
    else this.uiService.toast('No se pudo añadir el producto al carrito');
  }

}
