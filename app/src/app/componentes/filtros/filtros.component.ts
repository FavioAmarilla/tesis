import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LineasProductoService } from '../../servicios/linea-producto.service';
import { LineaProducto, Marca, Sucursal } from 'src/app/interfaces/interfaces';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { MarcaService } from 'src/app/servicios/marca.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
})
export class FiltrosComponent implements OnInit {

  public filtros: any;
  public listaSucursales: Sucursal;
  public listaLineas: LineaProducto;
  public listaMarcas: Marca;

  @Output() public filtrosEmitter = new EventEmitter();

  constructor(
    private servicioSucursal: SucursalService,
    private servicioLineaProd: LineasProductoService,
    private servicioMarca: MarcaService,
    private servicioAlerta: AlertaService
  ) {
    this.inicializarFiltros();
  }

  async ngOnInit() {
    await this.obtenersucursales();
    await this.obtenerLineasProducto();
    await this.obtenerMarcas();
    await this.enviarFiltros();
  }

  async inicializarFiltros() {
    this.filtros = {
      id_sucursal: 0,
      precio_minimo: 0,
      precio_maximo: 0,
      id_linea: 0,
      id_marca: 0
    };
  }

  async obtenersucursales() {
    let parametros = {
      ecommerce: 'S'
    };
    const response: any = await this.servicioSucursal.obtenerSucursal(null, parametros);

    if (response.success) {
      this.listaSucursales = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async obtenerLineasProducto() {
    const response: any = await this.servicioLineaProd.obtenerLinea();

    if (response.success) {
      this.listaLineas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async obtenerMarcas() {
    const response: any = await this.servicioMarca.obtenerMarca();
    if (response.success) {
      this.listaMarcas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async enviarFiltros() {
    if (this.filtros.id_sucursal <= 0) {
      delete this.filtros.id_sucursal
    }
    if (this.filtros.precio_minimo <= 0) {
      delete this.filtros.precio_minimo
    }
    if (this.filtros.precio_maximo <= 0) {
      delete this.filtros.precio_maximo
    }
    if (this.filtros.id_linea <= 0) {
      delete this.filtros.id_linea
    }
    if (this.filtros.id_marca <= 0) {
      delete this.filtros.id_marca
    }

    this.filtrosEmitter.emit(this.filtros);
  }

}
