import { Component, OnInit } from '@angular/core';
import { ServicioLineaProducto } from '../../servicios/linea-producto.service';
import { LineaProducto } from 'app/modelos/linea-producto';
import swal from'sweetalert2';

@Component({
  selector: 'app-linea-producto',
  templateUrl: './linea-producto.component.html',
  styleUrls: ['./linea-producto.component.scss']
})
export class LineaProductoComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = '';
  public lineaProducto: LineaProducto;
  public listaLineas: LineaProducto;
  public errores = [];

  constructor(
    private servicioLineaProducto: ServicioLineaProducto
  ) {  }

  ngOnInit() {
    this.obtenerLineas();
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.lineaProducto = new LineaProducto(null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async obtenerLineas() {
    this.listaLineas = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const response = <any> await this.servicioLineaProducto.obtenerLinea();

    if (response.status) {
      this.listaLineas = response.data;
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerLinea(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioLineaProducto.obtenerLinea(id);

    if (response.status) {
      this.lineaProducto = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioLineaProducto.registrar(this.lineaProducto);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerLineas();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'INS');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioLineaProducto.actualizar(this.lineaProducto, this.lineaProducto.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerLineas();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'UPD');
    }
  }

}
