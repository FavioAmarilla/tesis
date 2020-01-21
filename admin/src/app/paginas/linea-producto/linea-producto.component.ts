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
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioLineaProducto: ServicioLineaProducto
  ) {  }

  ngOnInit() {
    this.paginacion();
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

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaLineas = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const response = <any> await this.servicioLineaProducto.paginacion(pagina);

    if (response.status) {
      this.listaLineas = response.data.data;
      this.porPagina = response.data.per_page;
      this.total = response.data.total;
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
          this.paginacion();
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
          this.paginacion();
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
