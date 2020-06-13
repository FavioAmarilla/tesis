import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-pedido-modal',
  templateUrl: './detalle-pedido-modal.component.html',
  styleUrls: ['./detalle-pedido-modal.component.scss'],
})
export class DetallePedidoModalComponent implements OnInit {

  @Input() listaItems;
  displayedColumns: string[] = ['producto', 'cantidad', 'precio_venta', 'total'];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  cerrar() {
    this.modalController.dismiss();
  }

}
