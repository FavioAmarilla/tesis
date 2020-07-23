import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../modelos/pedido';
import { PedidoService } from 'app/servicios/pedido.service';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { environment } from '../../../environments/environment';
import { ComprobanteService } from 'app/servicios/comprobante.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {


  public cargando: boolean = false;
  public form = false;
  public accion: string = 'LST';
  public pedido: Pedido;
  public listaPedidos: Pedido;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioPedido: PedidoService,
    private servicioComprobante: ComprobanteService,
    private servicioAlerta: ServicioAlertas
  ) {
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      nombre: ''
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.pedido = new Pedido(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaPedidos = null;
    this.accion = 'LST';
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

    const response: any = await this.servicioPedido.obtener(null, this.parametros);
    if (response.success) {
      this.listaPedidos = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
      console.log(this.listaPedidos);
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerPais(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioPedido.obtener(id);

    if (response.success) {
      this.pedido = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message);
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
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

  ver(idFactura) {
    this.accion = 'LST';
    this.cargando = true;

    window.open(`${environment.api}/pedido/${idFactura}/pdf`, '_blank');

    this.cargando = false;
  }

  async generarComprobante(id_pedido) {
    this.accion = 'LST';
    this.cargando = true;

    let pedido = {
      id_pedido: id_pedido
    }
    let response: any = await this.servicioComprobante.registrar(pedido);

    if (response.success) {
      const responseEstado: any = await this.servicioPedido.cambiarEstado('EN CAMINO', id_pedido);

      if (responseEstado.success) {
        await this.paginacion();
        this.servicioAlerta.dialogoExito(response.message);

        setTimeout(() => {
          window.open(`${environment.api}/pedido/${id_pedido}/pdf`, '_blank');
        }, 1550);

      } else {
        this.servicioAlerta.dialogoError(response.message);
      }
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;


  }

  async terminarPedido(id_pedido) {
    this.accion = 'LST';
    this.cargando = true;

    const response: any = await this.servicioPedido.cambiarEstado('ENTREGADO', id_pedido);

    if (response.success) {
      await this.paginacion();
      this.servicioAlerta.dialogoExito(response.message);

      this.servicioAlerta.dialogoExito(response.message);
      // setTimeout(() => {
      //   window.open(`${environment.api}/pedido/${id_pedido}/pdf`, '_blank');
      // }, 1000);

    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

}
