import { Component, OnInit } from '@angular/core';
import { CuponDescuento } from 'app/modelos/cupon-descuento';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { CuponDescuentoService } from 'app/servicios/cupon-descuento.service';

@Component({
  selector: 'app-cupon-descuento',
  templateUrl: './cupon-descuento.component.html',
  styleUrls: ['./cupon-descuento.component.scss']
})
export class CuponDescuentoComponent implements OnInit {


  public cargando: boolean = false;
  public form = false;
  public accion: string = '';
  public cupon: CuponDescuento;
  public listaCupones: CuponDescuento;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioCupon: CuponDescuentoService,
    private servicioAlerta: ServicioAlertas
  ) {
    this.cargando = false;
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      descripcion: '',
      codigo: '',
      porc_desc: '',
      fecha_desde: '',
      fecha_hasta: '',
      usado: null
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion === 'INS') {
      this.cupon = new CuponDescuento(null, null, null, null, null, null, null);
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaCupones = null;
    this.accion = "LST";
    this.cargando = true;

    this.parametros = null;
    this.parametros = {
      paginar: true,
      page: this.paginaActual
    };

    if (parametrosFiltro) {
      this.parametrosTabla.forEach(element => {
        this.parametros[element.key] = element.value;
      });
    }

    const response: any = await this.servicioCupon.obtener(null, this.parametros);

    if (response.success) {
      this.listaCupones = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerCupon(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioCupon.obtener(id);

    if (response.success) {
      this.cupon = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.servicioCupon.registrar(this.cupon);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async actualizar() {
    this.cargando = true;
    const response: any = await this.servicioCupon.actualizar(this.cupon, this.cupon.identificador);

    this.cargando = false;
    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }

  async filtrarTabla(event?) {

    if (event) {
      let key = event.target.name;
      let value = event.target.value;
      let parametros = { key, value };
      this.parametrosTabla.push(parametros);

      await this.paginacion(null, parametros);
    } else {
      await this.inicializarFiltros();
      await this.paginacion(null, null);
    }
  }

}
