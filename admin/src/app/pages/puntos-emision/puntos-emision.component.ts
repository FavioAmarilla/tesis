import { Component, OnInit } from '@angular/core';
import { PuntoEmision } from '../../models/punto-emision';
import { PuntoEmisionService } from '../../services/punto-emision.service';

@Component({
  selector: 'app-puntos-emision',
  templateUrl: './puntos-emision.component.html',
  styleUrls: []
})
export class PuntosEmisionComponent implements OnInit {

  public form = false;
  public action: string = '';
  public puntosEmision: PuntoEmision;
  public puntoEmision: PuntoEmision;

  constructor(
    private puntoEmisionService: PuntoEmisionService
  ) { }

  ngOnInit() {
    this.getPuntoEmision();
  }

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.puntoEmision = new PuntoEmision(null, null, null, null);
    }
  }

  getPuntoEmision() {
    this.puntoEmisionService.getPuntoEmision().subscribe(
      (response: any) => {
        if (response.status) {
          this.puntosEmision = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getTipoImpuesto(id) {
    this.puntoEmisionService.getPuntoEmision(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.puntoEmision = response.data;
          this.viewForm(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.puntoEmisionService.register(this.puntoEmision).subscribe(
      (response: any) => {
        console.log('register: ', response);
        if (response.status) {
          this.getPuntoEmision();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  update() {
    this.puntoEmisionService.update(this.puntoEmision, this.puntoEmision.identificador).subscribe(
      (response: any) => {
        console.log('update: ', response);
        if (response.status) {
          this.getPuntoEmision();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

}
