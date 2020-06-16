import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { UbicacionPage } from '../../componentes/ubicacion/ubicacion.page';

import { BarrioService } from 'src/app/servicios/barrio.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { CuponDescuentoService } from 'src/app/servicios/cupon-descuento.service';
import { EcParametrosService } from 'src/app/servicios/ec-parametros.service';
import { ServicioUbicacion } from 'src/app/servicios/ubicacion.service';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

import { Barrio, CuponDescuento, EcParametro, EcParamCiudad, Pedido } from 'src/app/interfaces/interfaces';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';

declare var Bancard: any;

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
  public datosEnvio: FormGroup;
  public datosPago: FormGroup;
  public totales: any;

  public pedido: Pedido = {};

  public coordenadas;

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(
    private servicioPedido: PedidoService,
    private servicioUsuario: UsuarioService,
    private servicioBarrio: BarrioService,
    private servicioAlerta: AlertaService,
    private servicioCarrito: CarritoService,
    private servicioCupon: CuponDescuentoService,
    private servicioEcParametros: EcParametrosService,
    private servicioUbicacion: ServicioUbicacion,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.inicializarTotales();
    this.inicializarCuponDescuento();
    this.inicializarDatosPago();
    this.inicializarDatosEnvio();
    this.route.queryParams.subscribe(params => {
      if (params.pedido) { this.obtenerPedido(params.pedido); }
    });
  }

  async ngOnInit() {
    await this.obtenerParametrosEcommerce();
    await this.obtenerTotales();

    if (this.totales.subtotal < this.parametros.monto_minimo) {
      this.servicioAlerta.dialogoError('El monto de compra debe ser mayor a: ' + this.parametros.monto_minimo);
      this.router.navigate(['/carrito']);
    }

    this.cargando = false;
  }

  async obtenerPedido(id) {
    const response: any = await this.servicioPedido.obtenerPedido(id);
    if (response.success) {
      const pedido = response.data;
      this.pedido.identificador = id;

      Object.keys(pedido).map(key => {
        if (this.datosEnvio.controls[key]) { this.datosEnvio.controls[key].setValue(pedido[key]); }
        else if (this.datosPago.controls[key]) { this.datosPago.controls[key].setValue(pedido[key]); }
      });

      if (pedido.cupon) { this.cuponDescuento = pedido.cupon; }
    }
  }

  inicializarTotales() {
    this.totales = {
      subtotal: 0,
      delivery: 10000,
      descuento: 0,
      total: 0
    };
  }

  inicializarCuponDescuento() {
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

  inicializarDatosPago() {
    this.datosPago = this.formBuilder.group({
      tipo:    ['', Validators.required],
      importe: ['']
    }, {
      validators: [
        this.requiredValidator('tipo', '==', 'PERC', 'importe')
      ]
    });
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
    if (!this.datosEnvio.value.id_ciudad || this.datosEnvio.value.id_ciudad <= 0) {
      this.servicioAlerta.dialogoError('Debe selecciona una ciudad');
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

    if (coordenadas.marcador) {
      const ubicacion = `${coordenadas.marcador.lat},${coordenadas.marcador.lng}`;
      this.datosEnvio.controls.ubicacion.setValue(ubicacion);

      this.servicioUbicacion.validarUbicacion(this.datosEnvio.value.id_ciudad, coordenadas.marcador);
    }

  }

  inicializarDatosEnvio() {
    this.datosEnvio = this.formBuilder.group({
      tipo_envio:     [0,  Validators.required],
      id_pais:        [0],
      id_ciudad:      [0],
      id_barrio:      [0],
      direccion:      [''],
      ubicacion:      [''],
      persona:        [''],
      nro_documento:  [''],
      observacion:    ['']
    }, {
      validators: [
        this.requiredValidator('tipo_envio', '==', 'DE', 'id_pais'),
        this.requiredValidator('tipo_envio', '==', 'DE', 'id_ciudad'),
        this.requiredValidator('tipo_envio', '==', 'DE', 'id_barrio'),
        this.requiredValidator('tipo_envio', '==', 'DE', 'direccion'),
        this.requiredValidator('tipo_envio', '==', 'DE', 'ubicacion'),
        this.requiredValidator('tipo_envio', '==', 'RT', 'persona'),
        this.requiredValidator('tipo_envio', '==', 'RT', 'nro_documento')
      ]
    });
  }

  requiredValidator(masterControlLabel: string, operator: string, conditionalValue: any, slaveControlLabel: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const masterControl = group.controls[masterControlLabel];
      const slaveControl = group.controls[slaveControlLabel];
      if (eval(`'${masterControl.value}' ${operator} '${conditionalValue}'`) || !masterControl.value) {
        return Validators.required(slaveControl);
      }
      slaveControl.setErrors(null);
      return null;
    }
  }

  datosEnvioSelect(value, select) {

    if (select === 'pais') {
      this.cargando = true;
      this.obtenerParamCiudades(this.parametros.identificador);
    }

    if (select === 'ciudad') {
      this.cargando = true;
      this.asignarCoordenadas(value);
      this.obtenerBarrios(value);
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
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerCupones() {
    const codigo = this.cuponDescuento.codigo;

    if (codigo != '') {
      this.submitCuponDescuento = true;
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
        this.servicioAlerta.dialogoError(response.message);
      }
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
      this.servicioAlerta.dialogoError(response.message);
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
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  asignarCoordenadas(ciudadId) {
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
      this.servicioAlerta.dialogoError('Debe estar Logueado para confirmar la operacion');
      this.router.navigate(['/login']);
    }

    return (response) ? true : false;
  }

  async registrarPedido() {
    if (await this.obtenerUsuario() == false) {
      return;
    }

    this.cargando = true;

    const sucursal: any = await this.servicioCarrito.getStorage('sucursal');
    const fecha = moment().format('YYYY-MM-DD');
    const ubicacion = this.datosEnvio.value.ubicacion.split(',');

    this.pedido.id_cupon_descuento = this.cuponDescuento.identificador;
    this.pedido.id_usuario = this.usuario.sub;
    this.pedido.id_sucursal = sucursal;
    this.pedido.fecha = fecha;
    this.pedido.latitud = ubicacion[0];
    this.pedido.longitud = ubicacion[1];
    this.pedido.costo_envio = this.parametros.costo_delivery;
    this.pedido.estado = 'PENDIENTE';
    this.pedido.productos = [];
    this.pedido.pago = this.datosPago.value;

    // tslint:disable-next-line: forin
    for (const index in this.datosEnvio.value) {
      this.pedido[index] = this.datosEnvio.value[index];
    }
    this.carrito.forEach(element => {
      this.pedido.productos.push({...element});
    });

    if (this.pedido.identificador) {
      this.actualizarPedido();
      return;
    }

    this.registrarPedido();
  }

  async procesarPedido() {
    const response: any = await this.servicioPedido.registrar(this.pedido);

    if (response.success) {
      if (this.pedido.pago == 'PO') { this.pagoOnlineBancard(response.data.process_id); }
      else {
        this.servicioCarrito.removeStorage('carrito');
        this.servicioCarrito.obtenerCantidad('carrito');
        this.router.navigate(['/pago-finalizado']);
      }
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async actualizarPedido() {
    const response: any = await this.servicioPedido.actualizar(this.pedido, this.pedido.identificador);

    if (response.success) {
      if (this.pedido.pago == 'PO') { this.pagoOnlineBancard(response.data.process_id); }
      else {
        this.servicioCarrito.removeStorage('carrito');
        this.servicioCarrito.obtenerCantidad('carrito');
        this.router.navigate(['/pago-finalizado']);
      }
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  pagoOnlineBancard(process_id) {

    const styles = {
      'form-background-color': '#001b60',
      'button-background-color': '#4faed1',
      'button-text-color': '#fcfcfc',
      'button-border-color': '#dddddd',
      'input-background-color': '#fcfcfc',
      'input-text-color': '#111111',
      'input-placeholder-color': '#111111'
    };

    Bancard.Checkout.createForm('iframe-container', process_id, styles);

  }

  checkTipoPago(radio) {
    this.datosPago.controls.tipo.setValue(radio.value);
  }


}
