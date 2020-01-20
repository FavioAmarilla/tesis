import { Component, OnInit } from '@angular/core';
import { LineaProductoService } from '../../services/linea-producto.service';
import { LineaProducto } from 'app/models/linea-producto';
import swal from'sweetalert2';

@Component({
  selector: 'app-linea-producto',
  templateUrl: './linea-producto.component.html',
  styleUrls: ['./linea-producto.component.scss']
})
export class LineaProductoComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public action: string = '';
  public lineaProducto: LineaProducto;
  public listaLineas: LineaProducto;
  public errors = [];

  constructor(
    private lineaProductoService: LineaProductoService
  ) {  }

  ngOnInit() {
    this.getLineas();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.lineaProducto = new LineaProducto(null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getLineas() {
    this.listaLineas = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.lineaProductoService.getLinea();

    if (response.status) {
      this.listaLineas = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getLinea(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.lineaProductoService.getLinea(id);
    
    if (response.status) {
      this.lineaProducto = response.data;
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
    var response = <any>await this.lineaProductoService.register(this.lineaProducto);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getLineas();
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
    var response = <any>await this.lineaProductoService.update(this.lineaProducto, this.lineaProducto.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getLineas();
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
