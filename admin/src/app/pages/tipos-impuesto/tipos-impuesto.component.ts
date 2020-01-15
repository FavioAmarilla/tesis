import { Component, OnInit } from '@angular/core';
import { TipoImpuesto } from '../../models/tipo-impuesto';
import { TipoImpuestoService } from 'app/services/tipo-impuesto.service';

@Component({
  selector: 'app-tipos-impuesto',
  templateUrl: './tipos-impuesto.component.html'
})
export class TiposImpuestoComponent implements OnInit {

  public form = false;
  public action: string = '';
  public tipoImpuesto: TipoImpuesto;
  public tiposImpuesto: TipoImpuesto;

  constructor(
    private impuestoService: TipoImpuestoService
  ) { }

  ngOnInit() {
    this.getTiposImpuesto();
  }

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.tipoImpuesto = new TipoImpuesto(null, null, null);
    }
  }

  getTiposImpuesto() {
    this.impuestoService.getTipoImpuesto().subscribe(
      (response: any) => {
        if (response.status) {
          this.tiposImpuesto = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getTipoImpuesto(id) {
    this.impuestoService.getTipoImpuesto(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.tipoImpuesto = response.data;
          this.viewForm(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.impuestoService.register(this.tipoImpuesto).subscribe(
      (response: any) => {
        console.log('register: ', response);
        if (response.status) {
          this.getTiposImpuesto();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  update() {
    this.impuestoService.update(this.tipoImpuesto, this.tipoImpuesto.identificador).subscribe(
      (response: any) => {
        console.log('update: ', response);
        if (response.status) {
          this.getTiposImpuesto();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

}
