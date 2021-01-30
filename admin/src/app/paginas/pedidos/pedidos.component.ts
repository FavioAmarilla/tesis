import { Component, OnInit, ɵConsole } from '@angular/core';
import { Pedido } from '../../modelos/pedido';
import { PedidoService } from 'app/servicios/pedido.service';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { environment } from '../../../environments/environment';
import { ComprobanteService } from 'app/servicios/comprobante.service';
import { Usuario } from 'app/modelos/usuario';
import { ServicioUsuario } from 'app/servicios/usuario.service';

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
  public usuario: Usuario;
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
    private servicioUsuario: ServicioUsuario,
    private servicioAlerta: ServicioAlertas
  ) {
    this.inicializarFiltros();
  }

  async ngOnInit() {
    await this.obtenerUsuario();
    await this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      fecha: '',
      tipo_envio: '',
      persona: '',
      nro_documento: '',
      estado_pago: '',
      estado: ''
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


  async procesar(idPedido) {
    this.accion = 'LST';
    this.cargando = true;

    const responseEstado: any = await this.servicioPedido.cambiarEstado('EN PROCESO', idPedido);

    if (responseEstado.success) {
      await this.paginacion();
      this.servicioAlerta.dialogoExito('Pedido listo para procesar');

      setTimeout(() => {
        window.open(`${environment.api}/pedido/${idPedido}/pdf`, '_blank');
      }, 1550);

    } else {
      this.servicioAlerta.dialogoError(responseEstado.message);
    }

    this.cargando = false;
  }

  ver(idPedido) {
    this.accion = 'LST';
    this.cargando = true;

    window.open(`${environment.api}/pedido/${idPedido}/pdf`, '_blank');

    this.cargando = false;
  }

  async listo(idPedido, tipo) {
    this.accion = 'LST';
    this.cargando = true;

    const estado = (tipo == 'RT') ? 'LISTO' : 'EN CAMINO';
    console.log(estado);
    const responseEstado: any = await this.servicioPedido.cambiarEstado(estado, idPedido);

    if (responseEstado.success) {
      await this.paginacion();
      await this.generarComprobante(idPedido);
    } else {
      this.servicioAlerta.dialogoError(responseEstado.message);
    }

    this.cargando = false;
  }

  async generarComprobante(id_pedido) {
    this.accion = 'LST';
    this.cargando = true;

    let pedido = {
      id_pedido: id_pedido,
      usr_proceso: this.usuario.identificador
    }
    let response: any = await this.servicioComprobante.registrar(pedido);

    if (response.success) {
      await this.paginacion();
      this.servicioAlerta.dialogoExito('Comprobante generado');

      setTimeout(() => {
        window.open(`${environment.api}/pedido/${id_pedido}/ticket`, '_blank');
      }, 1550);
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
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  async obtenerUsuario() {
    this.usuario = await this.servicioUsuario.obtenerUsuario();
  }

  async devolucion(idPedido) {
    this.accion = 'LST';
    this.cargando = true;

    const responseEstado: any = await this.servicioPedido.devolucion(idPedido, this.usuario.identificador);

    if (responseEstado.success) {
      await this.paginacion();
      this.servicioAlerta.dialogoExito("Devolucion realizada con exito");
    } else {
      this.servicioAlerta.dialogoError(responseEstado.message);
    }

    this.cargando = false;
  }

}
