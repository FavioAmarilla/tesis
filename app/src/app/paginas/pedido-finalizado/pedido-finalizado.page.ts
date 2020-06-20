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

  constructor(
    private router: ActivatedRoute,
    private servicioCarrito: CarritoService
  ) {
    this.router.queryParams.subscribe(params => {
      if (params.status && params.status != 'payment_error') {
        this.success = true;
      }
    });
  }

  ngOnInit() {
    this.servicioCarrito.removeStorage('carrito');
    this.servicioCarrito.obtenerCantidad('carrito');
  }

}
