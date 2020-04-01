import { Component, OnInit } from '@angular/core';
import { Pais, Ciudad, Barrio, CuponDescuento, EcParametro, EcParamCiudad } from 'src/app/interfaces/interfaces';
import { PaisService } from 'src/app/servicios/pais.service';
import { CiudadService } from 'src/app/servicios/ciudad.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { ModalController } from '@ionic/angular';
import { UbicacionPage } from '../../componentes/ubicacion/ubicacion.page';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { CuponDescuentoService } from 'src/app/servicios/cupon-descuento.service';
import { EcParametrosService } from 'src/app/servicios/ec-parametros.service';
import { ServicioUbicacion } from 'src/app/servicios/ubicacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  public cargando = true;

  public listaPaises = [];
  public listaCiudades = [];
  public listaBarrios: Barrio;

  public parametros: EcParametro
  public paramCiudades: EcParamCiudad

  public mostrarCiudades = false;
  public mostrarBarrios = false;

  public cuponDescuento: CuponDescuento;
  public submitCuponDescuento = false;
  public datosEnvio: any;
  public totales: any;

  public coordenadas;

  constructor(
    private servicioPais: PaisService,
    private servicioCiudad: CiudadService,
    private servicioBarrio: BarrioService,
    private servicioAlerta: AlertaService,
    private servicioCarrito: CarritoService,
    private servicioCupon: CuponDescuentoService,
    private servicioEcParametros: EcParametrosService,
    private servicioUbicacion: ServicioUbicacion,
    private modalCtrl: ModalController,
    private router: Router

  ) {
    this.inicializarTotales();
    this.inicializarCuponDescuento();
    this.inicializarDatosEnvio();
  }

  async ngOnInit() {
    await this.obtenerParametrosEcommerce();
    await this.obtenerTotales();

    if (this.totales.subtotal < this.parametros.monto_minimo) {
      this.servicioAlerta.dialogoError('El monto de compra debe ser mayor a: ' + this.parametros.monto_minimo, '');
      this.router.navigate(['/carrito']);
    }

    this.cargando = false;
  }

  async inicializarTotales() {
    this.totales = {
      subtotal: 0,
      delivery: 10000,
      descuento: 0,
      total: 0
    };
  }

  async inicializarCuponDescuento() {
    this.cuponDescuento = {
      identificador: 0,
      descripcion: 0,
      codigo: '',
      porc_descuento: 0,
      fecha_desde: '',
      fecha_hasta: '',
      usado: ''
    };
  }

  async obtenerTotales() {
    this.inicializarTotales();

    let carrito = await this.servicioCarrito.obtenerCarrito();

    //obtener sub total
    await carrito.forEach(element => {
      this.totales.subtotal += element.precio_venta * element.cantidad;
    });

    //obtener costo delivery
    this.totales.delivery = this.parametros.costo_delivery;

    //obtener descuento por cupones
    if (this.cuponDescuento.identificador > 0) {
      let descuentoSubtotal = (this.cuponDescuento.porc_descuento * 100) / this.totales.subtotal;
      this.totales.descuento = descuentoSubtotal;
    }

    //obtener total
    this.totales.total = (this.totales.subtotal + this.totales.delivery) - this.totales.descuento;

    this.cargando = false;
  }

  async abrirModal() {
    const coords = this.coordenadas;

    const modal = await this.modalCtrl.create({
      component: UbicacionPage,
      componentProps: {
        coordenadas: coords
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    const { coordenadas } = data;
    this.datosEnvio.ubicacion = (coordenadas.marcador) ? `${coordenadas.marcador.lat},${coordenadas.marcador.lng}` : '';

    this.servicioUbicacion.validarUbicacion(this.datosEnvio.ciudad, coordenadas.marcador);
  }

  // validarUbicacion(ciudad, coordenadas) {
  //   this.u
  // }

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
      this.cargando = true;
      this.mostrarCiudades = true;
      this.obtenerParamCiudades(this.parametros.identificador);
    }

    if (select === 'ciudad') {
      this.cargando = true;
      this.mostrarBarrios = false;

      this.datosEnvio.ciudad = value;
      this.asignarCoordenadas(value);
      this.obtenerBarrios(value);
    }

    if (select === 'barrio') {
      this.datosEnvio.barrio = value;
    }
  }

  async obtenerBarrios(id_ciudad) {
    const parametros = {
      id_ciudad,
      activo: 'S'
    };

    const response: any = await this.servicioBarrio.obtenerBarrios(null, parametros);
    if (response.success) {
      this.listaBarrios = response.data;
      this.mostrarBarrios = true;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerCupones() {
    this.submitCuponDescuento = true;
    const codigo = this.cuponDescuento.codigo;

    const parametros = {
      codigo
    };

    const response: any = await this.servicioCupon.obtenerCupones(null, parametros);
    if (response.success) {
      this.cuponDescuento = response.data;
      this.cuponDescuento.codigo = codigo;

      this.obtenerTotales();
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerParametrosEcommerce() {
    const response: any = await this.servicioEcParametros.obtenerParametros();

    if (response.success) {
      this.parametros = response.data;
      this.listaPaises.push(response.data.pais);
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async obtenerParamCiudades(id_ec_parametro) {
    this.listaCiudades = [];
    const parametros = {
      id_ec_parametro,
      activo: 'S'
    };

    const response: any = await this.servicioEcParametros.obtenerParamCiudades(null, parametros);

    if (response.success) {
      response.data.forEach(element => {
        this.listaCiudades.push(element.ciudad);
      });
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  asignarCoordenadas(ciudadId) {
    const ciudad = this.listaCiudades.find(element => element.identificador == ciudadId);
    if (ciudad) {
      this.coordenadas = ciudad.coordenadas;
    }
  }

}
