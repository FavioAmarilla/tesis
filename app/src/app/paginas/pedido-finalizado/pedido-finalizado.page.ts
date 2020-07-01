import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from 'src/app/servicios/carrito.service';

@Component({
  selector: 'app-pedido-finalizado',
  templateUrl: './pedido-finalizado.page.html',
  styleUrls: ['./pedido-finalizado.page.scss'],
})
export class PedidoFinalizadoPage implements OnInit {

  public success = false;
  public description;

  constructor(
    private router: ActivatedRoute,
    private servicioCarrito: CarritoService
  ) {
    this.router.queryParams.subscribe(params => {
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
      case 'payment_success':
      case 'add_new_card_success':
        this.success = true;
        break;
      case 'payment_error':
      case 'add_new_card_fail':
      default:
        this.success = false;
        break;
    }
  }

}
