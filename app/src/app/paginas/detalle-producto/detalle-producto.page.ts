import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductoService } from '../../servicios/producto.service';
import { Producto } from '../../interfaces/interfaces';

import { CarritoService } from '../../servicios/carrito.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class PaginaDetalleProducto implements OnInit {

  public url;
  public slug: string;
  public pageId;
  public cargando = true;
  public producto: any;
  public relacionados: Producto[] = [];

  public cantidad: number = 1;
  public minimo = 1;
  public valor = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private servicioProducto: ProductoService,
    private servicioCarrito: CarritoService,
    private servicioGeneral: GeneralService,
    private servicioAlerta: AlertaService
  ) {
    this.route.params.subscribe(params => {
      this.url = window.location.href;
      this.slug = params['slug'];
      this.pageId = this.slug;
      this.obtenerProducto(this.slug);
    });
  }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    this.initDisqus();
  }

  initDisqus() {
    this.servicioGeneral.addDisqusScript(this.url, this.pageId);
  }

  async obtenerProducto(slug) {
    this.cargando = true;
    const response: any = await this.servicioProducto.obtenerProducto(slug);

    if (response.success) {
      this.cargando = false;
      this.producto = response.data;
      this.relacionados = this.producto.relacionados;
      this.cantidad = this.minimo = this.servicioGeneral.unidadMedida(this.producto.vr_unidad_medida, 'minimo');
      this.valor = this.servicioGeneral.unidadMedida(this.producto.vr_unidad_medida);
    } else {
      this.servicioAlerta.dialogoError(response.message);
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

    if (add) this.servicioAlerta.dialogoCarrito('El producto ha sido añadido al carrito');
    else this.servicioAlerta.dialogoError('No se pudo añadir el producto al carrito');
  }

}
