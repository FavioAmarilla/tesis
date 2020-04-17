import { Component, OnInit } from '@angular/core';
import { Barrio, CuponDescuento, EcParametro, EcParamCiudad } from 'src/app/interfaces/interfaces';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { ModalController } from '@ionic/angular';
import { UbicacionPage } from '../../componentes/ubicacion/ubicacion.page';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { CuponDescuentoService } from 'src/app/servicios/cupon-descuento.service';
import { EcParametrosService } from 'src/app/servicios/ec-parametros.service';
import { ServicioUbicacion } from 'src/app/servicios/ubicacion.service';
import { Router } from '@angular/router';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { trigger, style, animate, transition, state } from '@angular/animations';
import * as moment from 'moment';

@Component({
  selector: 'app-pedido',
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]
    )
  ],
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss']
})
export class PedidoPage implements OnInit {

  public cargando = true;

  public listaPaises = [];
  public listaCiudades = [];
  public listaBarrios: Barrio;
  public carrito: any;
  public usuario: any;

  public parametros: EcParametro
  public paramCiudades: EcParamCiudad

  public mostrarCiudades = false;
  public mostrarBarrios = false;

  public cuponDescuento: CuponDescuento;
  public submitCuponDescuento = false;
  public datosEnvio: any;
  public datosPago: any;
  public totales: any;

  public coordenadas;

  constructor(
    private serivioPedido: PedidoService,
    private servicioUsuario: UsuarioService,
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
    this.inicializarDatosPago();
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

  async inicializarDatosPago() {
    this.datosPago = {
      tipo: ''
    };
  }

  async obtenerTotales() {
    this.inicializarTotales();

    this.carrito = await this.servicioCarrito.obtenerCarrito();

    // obtener sub total
    await this.carrito.forEach(element => {
      this.totales.subtotal += element.precio_venta * element.cantidad;
    });

    // obtener costo delivery
    this.totales.delivery = this.parametros.costo_delivery;

    // obtener descuento por cupones
    if (this.cuponDescuento.identificador > 0) {
      let descuentoSubtotal = (this.cuponDescuento.porc_descuento * 100) / this.totales.subtotal;
      this.totales.descuento = descuentoSubtotal;
    }

    // obtener total
    this.totales.total = (this.totales.subtotal + this.totales.delivery) - this.totales.descuento;

    this.cargando = false;
  }

  async abrirModal() {
    if (!this.datosEnvio.ciudad || this.datosEnvio.ciudad <= 0) {
      this.servicioAlerta.dialogoError('Debe selecciona una ciudad', '');
      return;
    }
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

  async inicializarDatosEnvio() {
    this.datosEnvio = {
      tipo_envio: '',
      pais: 0,
      ciudad: 0,
      barrio: 0,
      direccion: '',
      ubicacion: '',
      observacion: ''
    };
  }

  datosEnvioSelect(value, select) {
    if (select === 'tipo_envio') {
      this.datosEnvio.tipo_envio = value;
    }
    if (select === 'pais') {
      this.cargando = true;
      this.datosEnvio.pais = value;
      this.obtenerParamCiudades(this.parametros.identificador);
    }

    if (select === 'ciudad') {
      this.cargando = true;
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
      this.mostrarCiudades = true;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async asignarCoordenadas(ciudadId) {
    const ciudad = this.listaCiudades.find(element => element.identificador == ciudadId);
    if (ciudad) {
      this.coordenadas = ciudad.coordenadas;
    }
  }

  async obtenerUsuario() {
    const response: any = await this.servicioUsuario.obtenerUsuario();
    console.log(response);
    if (response) {
      this.usuario = response;
    } else {
      this.servicioAlerta.dialogoError('Debe estar Logueado para confirmar la operacion', '');
      this.router.navigate(['/login']);
    }

    return (response) ? true : false;
  }

  async registrarPedido() {
    let pedido: any = {};
    if (await this.obtenerUsuario() == false) {
      return;
    }

    const sucursal: any = await this.servicioCarrito.getStorage('sucursal');
    const fecha = moment().format('YYYY-MM-DD');
    const ubicacion = this.datosEnvio.ubicacion.split(',');

    pedido.id_cupon_descuento = this.cuponDescuento.identificador;
    pedido.id_usuario = this.usuario.sub;
    pedido.id_sucursal = sucursal;
    pedido.fecha = fecha;
    pedido.id_pais = this.datosEnvio.pais;
    pedido.id_ciudad = this.datosEnvio.ciudad;
    pedido.id_barrio = this.datosEnvio.barrio;
    pedido.direccion = this.datosEnvio.direccion;
    pedido.latitud = ubicacion[0];
    pedido.longitud = ubicacion[1];
    pedido.costo_envio = this.parametros.costo_delivery;
    pedido.observacion = this.datosEnvio.observacion;
    pedido.tipo_envio = this.datosEnvio.tipo_envio;
    pedido.estado = 'PENDIENTE';
    pedido.productos = [];
    this.carrito.forEach(element => {
      pedido.productos.push(element);
    });

    const response: any = await this.serivioPedido.registrar(pedido);
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message, '');
      this.servicioCarrito.removeStorage('carrito');
      this.servicioCarrito.obtenerCantidad('carrito');
      this.router.navigate(['/pedido-lista']);
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async checkTipoPago(value) {
    this.datosPago.tipo = value;
  }


}
