import { Component, OnInit } from '@angular/core';
import { Pais } from '../../models/pais';
import { PaisService } from '../../services/pais.service';
import swal from'sweetalert2';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.scss']
})
export class PaisComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public action: string = 'LST';
  public pais: Pais;
  public listaPaises: Pais;
  public errors = [];

  constructor(
    private paisService: PaisService
  ) { }

  ngOnInit() {
    this.getPaises();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.pais = new Pais(null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getPaises() {
    this.listaPaises = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.paisService.getPais();

    if (response.status) {
      this.listaPaises = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getPais(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.paisService.getPais(id);

    if (response.status) {
      this.pais = response.data;
      this.viewForm(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async register() {
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.paisService.register(this.pais);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getPaises();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.viewForm(true, 'INS');
    }
  }

  async update() {
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.paisService.update(this.pais, this.pais.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getPaises();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.viewForm(true, 'UPD');
    }
  }


}
