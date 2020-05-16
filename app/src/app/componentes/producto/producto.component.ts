import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/interfaces/interfaces';
import { GeneralService } from 'src/app/servicios/general.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { AlertaService } from 'src/app/servicios/alerta.service';

@Component({
  selector: 'cp-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  @Input() producto: Producto;

  constructor(
    private servicioAlerta: AlertaService,
    private servicioCarrito: CarritoService,
    private servicioGeneral: GeneralService
  ) { }

  ngOnInit() {}

  async agregarAlCarrito(producto: any) {
    producto.cantidad = this.servicioGeneral.unidadMedida(producto.vr_unidad_medida, 'medida');
    const add = this.servicioCarrito.agregarAlCarrito(producto);

    if (add) this.servicioAlerta.dialogoExito('El producto ha sido añadido al carrito', '');
    else this.servicioAlerta.dialogoError('No se pudo añadir el producto al carrito', '');
  }

  async agregarAFavoritos(producto: any) {
    producto.cantidad = this.servicioGeneral.unidadMedida(producto.vr_unidad_medida, 'medida');
    const add = this.servicioCarrito.agregarAFavoritos(producto);

    if (add) this.servicioAlerta.dialogoExito('El producto ha sido añadido sus favoritos', '');
    else this.servicioAlerta.dialogoError('No se pudo añadir el producto sus favoritos', '');
  }

}
