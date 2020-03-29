import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LineasProductoService } from "../../servicios/linea-producto.service";
import { LineaProducto } from 'src/app/interfaces/interfaces';
import { AlertaService } from 'src/app/servicios/alerta.service';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
})
export class FiltrosComponent implements OnInit {

  public filtros: any;
  public listaLineas: LineaProducto;

  constructor(
    private modalCtrl: ModalController,
    private servicioLineaProd: LineasProductoService,
    private servicioAlerta: AlertaService
  ) {
    this.inicializarFiltros();
  }

  ngOnInit() { }

  async inicializarFiltros() {
    this.filtros = {
      precio_minimo: 0,
      precio_maximo: 0,
      linea: 0,
      marca: 0
    };
  }

  async cerrarModal() {
    await this.modalCtrl.dismiss({

    });
  }

  async obtenerLineasProducto() {
    const response: any = await this.servicioLineaProd.obtenerLinea();

    if (response.success) {
      this.listaLineas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

}
