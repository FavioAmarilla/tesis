import { Component, OnInit } from '@angular/core';
import { Pais, Ciudad, Barrio } from 'src/app/interfaces/interfaces';
import { PaisService } from 'src/app/servicios/pais.service';
import { CiudadService } from 'src/app/servicios/ciudad.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { ModalController } from '@ionic/angular';
import { UbicacionPage } from '../modals/ubicacion/ubicacion.page';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  public cargando = true;

  public listaPaises: Pais;
  public listaCiudades: Ciudad;
  public listaBarrios: Barrio;

  public mostrarCiudades = false;
  public mostrarBarrios = false;

  public datosEnvio: any;
  public totales: any;

  constructor(
    private servicioPais: PaisService,
    private servicioCiudad: CiudadService,
    private servicioBarrio: BarrioService,
    private modalCtrl: ModalController
  ) {
    this.inicializarDatosEnvio();
    this.obtenerPaises();
  }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: UbicacionPage
    });

    modal.onWillDismiss().then(data => {
      console.log('MODAL DATA', data);
    });

    return await modal.present();
  }

  async inicializarDatosEnvio() {
    this.datosEnvio = {
      pais: 0,
      ciudad: 0,
      barrio: 0,
      direccion: '',
      ubicacion: ''
    };
  }
  datosEnvioSelect(value, select) {
    if (select === 'pais') {
      this.mostrarCiudades = false

      this.datosEnvio.pais = value;
      this.obtenerCiudades(value);
    }
    if (select === 'ciudad') {
      this.mostrarBarrios = false

      this.datosEnvio.ciudad = value;
      this.obtenerBarrios(value);
    }
    if (select === 'barrio') {
      this.datosEnvio.barrio = value;
    }
  }

  async obtenerPaises() {
    const response: any = await this.servicioPais.obtenerPaises();
    if (response.status) {
      this.listaPaises = response.data;
    } else {

    }
  }

  async obtenerCiudades(id_pais) {
    console.log('id_pais', id_pais);
    let parametros = {
      id_pais
    };

    const response: any = await this.servicioCiudad.obtenerCiudades(null, parametros);
    console.log(response);
    if (response.status) {
      this.listaCiudades = response.data;
      this.mostrarCiudades = true
    } else {

    }
  }

  async obtenerBarrios(id_ciudad) {
    let parametros = {
      id_ciudad
    };

    const response: any = await this.servicioBarrio.obtenerBarrios(null, parametros);
    if (response.status) {
      this.listaBarrios = response.data;
      this.mostrarBarrios = true;
    } else {

    }
  }

}
