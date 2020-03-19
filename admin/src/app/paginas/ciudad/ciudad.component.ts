import { Component, OnInit, ɵConsole } from '@angular/core';
import { Ciudad } from '../../modelos/ciudad';
import { ServicioCiudad } from '../../servicios/ciudad.service';
import { ServicioPais } from '../../servicios/pais.service';
import { Pais } from '../../modelos/pais';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.scss']
})
export class CiudadComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = '';
  public ciudad: Ciudad;
  public listaCiudades: Ciudad;
  public listaPaises: Pais;
  public errores = [];
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioCiudad: ServicioCiudad,
    private servicioPais: ServicioPais
  ) {
    this.cargando = false;
   }

  ngOnInit() {
    this.paginacion(this.paginaActual);
    this.obtenerPaises();
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.ciudad = new Ciudad(null, null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async obtenerPaises() {
    const response = <any>await this.servicioPais.obtenerPais();

    if (response.status) {
      this.listaPaises = response.data.data;
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }
  }

  async paginacion(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaCiudades = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const parametros = {
      paginar: true,
      page: this.paginaActual
    };

    const response: any = await this.servicioCiudad.obtenerCiudad(null, parametros);

    if (response.status) {
      this.listaCiudades = response.data.data;
      this.porPagina = response.data.per_page;
      this.total = response.data.total;
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerCiudad(id) {
    this.accion = "LST";
    this.cargando = true;

    this.errores = [];
    const response = <any>await this.servicioCiudad.obtenerCiudad(id);

    if (response.status) {
      this.ciudad = response.data;
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
    const response = <any>await this.servicioCiudad.registrar(this.ciudad);

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
    const response: any = await this.servicioCiudad.actualizar(this.ciudad, this.ciudad.identificador);

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
