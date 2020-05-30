import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lineas-modal',
  templateUrl: './lineas-modal.component.html',
  styleUrls: ['./lineas-modal.component.scss'],
})
export class LineasModalComponent implements OnInit {

  @Input() listaLineas;
  @Input() idLineaProducto;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  seleccionarLineaProducto(id) {
    this.modalController.dismiss({
      idLineaProducto: id
    });
  }

  close() {
    this.modalController.dismiss();
  }

}
