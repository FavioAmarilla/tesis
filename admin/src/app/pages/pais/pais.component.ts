import { Component, OnInit } from '@angular/core';
import { Pais } from '../../models/pais';
import { PaisService } from '../../services/pais.service';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.scss']
})
export class PaisComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public action: string = '';
  public pais: Pais;
  public listaPaises: Pais;
  public errors = [];

  constructor(
    private paisService: PaisService
  ) {
    this.cargando = false;
   }

  ngOnInit() {
    this.getPaises();
  }

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.pais = new Pais(null, null);
    }
  }

  getPaises() {
    this.paisService.getPais().subscribe(
      (response: any) => {
        if (response.status) {
          this.listaPaises = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getPais(id) {
    this.paisService.getPais(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.pais = response.data;
          this.viewForm(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.cargando = true;

    this.errors = [];
    this.paisService.register(this.pais).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.getPaises();
        } else {
          for (const i in response.data) {
            this.errors.push(response.data[i]);
          }
        }
      },
      error => {
        console.log('Error: ', error);
      }
    );

    this.cargando = false;
  }

  update() {
    this.cargando = true;

    this.errors = [];
    this.paisService.update(this.pais, this.pais.identificador).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.getPaises();
        } else {
          for (const i in response.data) {
            this.errors.push(response.data[i]);
          }
        }
      },
      error => {
        console.log('Error: ', error);
      }
    );

    this.cargando = false;
  }


}
