import { Component, OnInit } from '@angular/core';
import { Pais } from '../../modelos/pais';
import { ServicioPais } from '../../servicios/pais.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.scss']
})
export class PaisComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = 'LST';
  public pais: Pais;
  public listaPaises: Pais;
  public errors = [];
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioPais: ServicioPais
  ) { }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.pais = new Pais(null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaPaises = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errors = [];

    const response: any = await this.servicioPais.obtenerPais(null, pagina);
    if (response.status) {
      this.listaPaises = response.data.data;
      this.porPagina = response.data.per_page;
      this.total = response.data.total;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerPais(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioPais.obtenerPais(id);

    if (response.status) {
      this.pais = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioPais.registrar(this.pais);

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
        this.errors.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'INS');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errors = [];
    const response: any = await this.servicioPais.actualizar(this.pais, this.pais.identificador);

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
        this.errors.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'UPD');
    }
  }


}
