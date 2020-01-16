import { Component, OnInit, ɵConsole } from '@angular/core';
import { Ciudad } from '../../models/ciudad';
import { CiudadService } from '../../services/ciudad.service';
import { PaisService } from '../../services/pais.service';
import { Pais } from 'app/models/pais';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.scss']
})
export class CiudadComponent implements OnInit {

  
  public cargando: boolean = false;
  public form = false;
  public action: string = '';
  public ciudad: Ciudad;
  public listaCiudades: Ciudad;
  public listaPaises: Pais;
  public errors = [];
  public mensaje: string = "";

  constructor(
    private ciudadService: CiudadService,
    private paisService: PaisService
  ) {
    this.cargando = false;
    this.mensaje = null;
   }

  ngOnInit() {
    this.getCiudades();
    this.getPaises();
  }

  viewForm(flag, action) {
    this.form = flag
    this.action = action;
    this.cargando = false;
    this.mensaje = "";

    if (flag && action == 'INS') {
      this.ciudad = new Ciudad(null, null, null);
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

  getCiudades() {
    console.log(this.mensaje);
    this.ciudadService.getCiudad().subscribe(
      (response: any) => {
        if (response.status) {
          this.listaCiudades = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getCiudad(id) {
    this.ciudadService.getCiudad(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.ciudad = response.data;
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
     this.ciudadService.register(this.ciudad).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.mensaje = response.message.toString();
          this.getCiudades();
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
    this.ciudadService.update(this.ciudad, this.ciudad.identificador).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.mensaje = response.message.toString();
          this.getCiudades();
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
