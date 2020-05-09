import { Component, OnInit } from '@angular/core';
import { EcParametro } from 'app/modelos/ec-parametros';
import { Ciudad } from 'app/modelos/ciudad';
import { Pais } from 'app/modelos/pais';
import { Sucursal } from 'app/modelos/sucursal';
import { EcParametrosService } from 'app/servicios/ec-parametros.service';
import { ServicioSucursal } from 'app/servicios/sucursal.service';
import { ServicioPais } from 'app/servicios/pais.service';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { ServicioCiudad } from 'app/servicios/ciudad.service';

@Component({
  selector: 'app-ec-parametros',
  templateUrl: './ec-parametros.component.html',
  styleUrls: ['./ec-parametros.component.scss']
})
export class EcParametrosComponent implements OnInit {

  public cargando: boolean = true;
  public cargandoSucursales: boolean = false;
  public cargandoCiudades: boolean = false;

  public form = false;
  public accion: string = 'LST';
  public ecParametro: EcParametro;
  public listaParametros: EcParametro;
  public listaPaises: Pais;
  public listaCiudades: Ciudad;
  public listaSucursales: Sucursal;
  public listaSucursalesTmp = [];
  public listaCiudadesTmp = [];

  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []

  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioParametro: EcParametrosService,
    private servicioSucursal: ServicioSucursal,
    private servicioPais: ServicioPais,
    private servicioCiudad: ServicioCiudad,
    private servicioAlerta: ServicioAlertas
  ) {
    this.inicializarFiltros();
  }

  async ngOnInit() {
    await this.obtenerPaises();
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      monto_minimo: '',
      costo_delivery: '',
      id_pais: null
    }
  }

  async mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion === 'INS') {
      this.cargandoSucursales = true;
      this.ecParametro = new EcParametro(null, null, null, null, null, null, null);
      await this.obtenerSucursales(null, null, true);
      await this.obtenerPaises();
      this.listaCiudades = null;
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaParametros = null;
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

    const response: any = await this.servicioParametro.obtener(null, this.parametros);

    if (response.success) {
      this.listaParametros = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerParametro(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioParametro.obtener(id);

    if (response.success) {
      this.ecParametro = response.data;
      await this.obtenerPaises();
      await this.obtenerSucursales(null, null, false);
      let parametros = { key: 'id_pais', value: this.ecParametro.id_pais };
      await this.obtenerCiudades(null, parametros, false);

      await this.obtenerParamSucursales();
      await this.obtenerParamCiudades()

      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async obtenerPaises() {
    const response: any = await this.servicioPais.obtener();

    if (response.success) {
      this.listaPaises = response.data
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
  }

  async seleccionarPais(id_pais) {
    let parametros = { key: 'id_pais', value: id_pais };
    this.obtenerCiudades(null, parametros, true);
  }

  async obtenerSucursales(pagina?, parametrosFiltro?, cargando?) {
    if (cargando) {
      this.cargandoSucursales = cargando;
    }
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaSucursales = null;

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


    const response: any = await this.servicioSucursal.obtener(null, this.parametros);

    if (response.success) {
      this.listaSucursales = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.cargandoSucursales = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargandoSucursales = false;
  }

  obtenerParamSucursales() {
    this.listaSucursalesTmp = [];
    if (this.accion != 'INS') {
      this.ecParametro.sucursales.forEach(element => {
        this.listaSucursalesTmp.push(element.id_sucursal)
      });
    }
  }

  seleccionarSucursal(id, event) {
    const add = event.target.checked;

    if (add) {
      this.listaSucursalesTmp.push(id);
    } else {
      var index = this.listaSucursalesTmp.indexOf(id);
      if (index >= 0) {
        this.listaSucursalesTmp.splice(index, 1);
      }
    }
  }

  async obtenerCiudades(pagina?, parametrosFiltro?, cargando?) {
    if (cargando) {
      this.cargandoCiudades = cargando;
    }
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaCiudades = null;

    this.parametros = null;
    this.parametros = {
      paginar: true,
      page: this.paginaActual
    };

    if (parametrosFiltro) {
      this.parametrosTabla.forEach(element => {
        this.parametros[element.key] = element.value;
      });
      this.parametros[parametrosFiltro.key] = parametrosFiltro.value;
    }

    console.log(this.parametros);
    const response: any = await this.servicioCiudad.obtener(null, this.parametros);

    if (response.success) {
      this.listaCiudades = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.cargandoCiudades = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargandoCiudades = false;
  }

  obtenerParamCiudades() {
    this.listaCiudadesTmp = [];
    if (this.accion != 'INS') {
      this.ecParametro.ciudades.forEach(element => {
        this.listaCiudadesTmp.push(element.id_ciudad)
      });
    }
  }

  seleccionarCiudad(id, event) {
    const add = event.target.checked;

    if (add) {
      this.listaCiudadesTmp.push(id);
    } else {
      var index = this.listaCiudadesTmp.indexOf(id);
      if (index >= 0) {
        this.listaCiudadesTmp.splice(index, 1);
      }
    }
  }

  async filtrarTabla(metodo?, event?) {
    if (event) {
      let key = event.target.name;
      let value = event.target.value;
      let parametros = { key, value };
      this.parametrosTabla.push(parametros);
      console.log(this.parametrosTabla);

      if (metodo == 'paginacion') {
        await this.paginacion(null, parametros);
      } else if (metodo == 'obtenerSucursales') {
        await this.obtenerSucursales(null, parametros, true);
      } else if (metodo == 'obtenerCiudades') {
        await this.obtenerCiudades(null, parametros, true);
      }
    } else {
      await this.inicializarFiltros();

      if (metodo == 'paginacion') {
        await this.paginacion(null, null);
      } else if (metodo == 'obtenerSucursales') {
        await this.obtenerSucursales(null, null, true);
      } else if (metodo == 'obtenerCiudades') {
        await this.obtenerCiudades(null, null, true);
      }
    }
  }

  verificarCheck(modelo, id): boolean {
    let lista: any = {};
    let index = 0;
    let check = false;

    if (modelo == 'sucursal') {
      lista = this.ecParametro.sucursales || [];
      index = lista.findIndex(data => data.id_sucursal == id);
      check = (index != -1) ? true : false;
    } else if (modelo == 'ciudad') {
      lista = this.ecParametro.ciudades || [];
      index = lista.findIndex(data => data.id_ciudad == id);
      check = (index != -1) ? true : false;
    }

    return check;
  }

  async registrar() {
    this.cargando = true;
    this.ecParametro.sucursales = this.listaSucursalesTmp;
    this.ecParametro.ciudades = this.listaCiudadesTmp;
    const response: any = await this.servicioParametro.registrar(this.ecParametro);

    this.cargando = false;
    if (response.success) {
      this.listaSucursalesTmp = [];
      this.listaCiudadesTmp = [];
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async actualizar() {
    this.cargando = true;
    this.ecParametro.sucursales = this.listaSucursalesTmp;
    this.ecParametro.ciudades = this.listaCiudadesTmp;
    const response: any = await this.servicioParametro.actualizar(this.ecParametro, this.ecParametro.identificador);

    this.cargando = false;
    if (response.success) {
      this.listaSucursalesTmp = [];
      this.listaCiudadesTmp = [];
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

}
