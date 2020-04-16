import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-listado',
  templateUrl: './pedido-listado.page.html',
  styleUrls: ['./pedido-listado.page.scss'],
})
export class PedidoListadoPage implements OnInit {

  public cargando = true;
  public listaPedido: any;
  public listaItems: any;

  constructor(
    private servicioPedido: PedidoService,
    private servicioUsuario: UsuarioService,
    private servicioAlerta: AlertaService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.obtenerPedidos();
  }

  async obtenerPedidos() {
    const usuario: any = await this.servicioUsuario.obtenerUsuario();
    let parametros = {
      id_usuario: usuario.sub
    }

    const response: any = await this.servicioPedido.obtenerPedido(null, parametros);
    if (response.success) {
      this.listaPedido = response.data;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
      this.router.navigate(['/inicio']);
    }

    this.cargando = false;
  }

  async obtenerItems(id_pedido) {
    this.cargando = true;

    let parametros = {
      id_pedido
    };
    const response: any = await this.servicioPedido.obtenerItems(parametros);
    if (response.success) {
      this.listaItems = response.data;
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

}
