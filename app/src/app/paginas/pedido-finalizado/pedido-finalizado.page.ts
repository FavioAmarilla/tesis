import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { PedidoService } from 'src/app/servicios/pedido.service';

@Component({
  selector: 'app-pedido-finalizado',
  templateUrl: './pedido-finalizado.page.html',
  styleUrls: ['./pedido-finalizado.page.scss'],
})
export class PedidoFinalizadoPage implements OnInit {

  public success = false;
  public description;
  public idPedido;
  public cargando = true;

  constructor(
    private router: ActivatedRoute,
    private servicioCarrito: CarritoService,
    private servicioPedido: PedidoService
  ) {
    this.router.queryParams.subscribe(params => {
      if (params.pedido) { this.idPedido = params.pedido; }
      if (params.status) {
        this.verificarEstado(params.status);
      }
      if (params.description) { this.description = params.description; }
    });
  }

  ngOnInit() {
    this.servicioCarrito.removeStorage('carrito');
    this.servicioCarrito.obtenerCantidad('carrito');
  }

  verificarEstado(estado) {
    switch (estado) {
      case 'PERC':
      case 'PCTCD':
      case 'payment_success':
        this.success = true;
        break;
      case 'add_new_card_success':
        this.procesarPedido();
        break;
      case 'payment_error':
      case 'add_new_card_fail':
      default:
        this.success = false;
        break;
    }
    this.cargando = false;
  }

  async procesarPedido() {
    this.cargando = true;
    if (this.idPedido) {
      const response: any = await this.servicioPedido.pagarConTarjetaAgregada(this.idPedido);

      this.success = response.success;
    }
    this.cargando = false;
  }
}
