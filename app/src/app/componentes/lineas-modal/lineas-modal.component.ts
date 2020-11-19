import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lineas-modal',
  templateUrl: './lineas-modal.component.html',
  styleUrls: ['./lineas-modal.component.scss'],
})
export class LineasModalComponent implements OnInit {

  @Input() listaLineas;
  @Input() idsCategorias = [];
  @Input() listaMarcas;
  @Input() idsMarcas = [];
  @Input() listaSucursales;
  private order: string = '';


  constructor(
    private modalController: ModalController
  ) {
    if (!this.order) {
      this.order = 'created_at';
    }
  }

  ngOnInit() { }

  filtrar() {
    this.modalController.dismiss({
      idsCategorias: this.idsCategorias,
      idsMarcas: this.idsMarcas,
      order: this.order
    });
  }

  verificarCheck(modelo, id): boolean {
    let lista: any = {};
    let index = 0;
    let check = false;

    if (modelo == 'categoria') {
      lista = this.idsCategorias || [];
      index = lista.findIndex(data => data == id);
      check = (index != -1) ? true : false;
    } else if (modelo == 'marca') {
      lista = this.idsMarcas || [];
      index = lista.findIndex(data => data == id);
      check = (index != -1) ? true : false;
    }

    return check;
  }

  close() {
    this.modalController.dismiss();
  }

  seleccionarCategoria(id: number, event) {
    const add = event.target.checked;
    if (add) {
      this.idsCategorias.push(id);
    } else {
      var index = this.idsCategorias.indexOf(id);
      if (index >= 0) {
        this.idsCategorias.splice(index, 1);
      }
    }
  }

  seleccionarMarca(id: number, event) {
    const add = event.target.checked;

    if (add) {
      this.idsMarcas.push(id);
    } else {
      var index = this.idsMarcas.indexOf(id);
      if (index >= 0) {
        this.idsMarcas.splice(index, 1);
      }
    }
  }


  async ordenar(value) {
    this.order = value;
  }

}
