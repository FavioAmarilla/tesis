import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../servicios/producto.service';
import { Producto } from '../../interfaces/interfaces';
import { CarritoService } from '../../servicios/carrito.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { AlertaService } from 'src/app/servicios/alerta.service';

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
  public minimo = 1;
  public valor = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioProducto: ProductoService,
    private servicioCarrito: CarritoService,
    private servicioGeneral: GeneralService,
    private servicioAlerta: AlertaService
  ) {
    this.route.params.subscribe(
      params => {
        this.id = + params['id'];
        this.obtenerProducto(this.id);
      }
    );
  }

  ngOnInit() { }

  async obtenerProducto(id) {
    this.cargando = true;
    const response: any = await this.servicioProducto.obtenerProducto(id);

    if (response.status) {
      this.cargando = false;
      this.producto = response.data;
      this.cantidad = this.minimo = this.servicioGeneral.unidadMedida(this.producto.vr_unidad_medida, 'minimo');
      this.valor = this.servicioGeneral.unidadMedida(this.producto.vr_unidad_medida);
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.router.navigate(['/']);
    }
    this.cargando = false;
  }

  asignarCantidad(accion) {
    if (accion == 'DI') {
      this.cantidad = (this.cantidad > this.minimo) ? this.cantidad - this.valor : this.minimo;
    }
    if (accion == 'AU') {
      this.cantidad += this.valor;
    }
  }

  async agregarAlCarrito() {
    this.producto.cantidad = this.cantidad;
    const add = await this.servicioCarrito.agregarAlCarrito(this.producto);

    if (add) this.servicioAlerta.dialogoExito('El producto ha sido añadido al carrito', '');
    else this.servicioAlerta.dialogoError('No se pudo añadir el producto al carrito', '');
  }

}
