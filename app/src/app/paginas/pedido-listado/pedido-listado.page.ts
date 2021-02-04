import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ActionSheetController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { DetallePedidoModalComponent } from 'src/app/componentes/detalle-pedido-modal/detalle-pedido-modal.component';

import { PedidoService } from 'src/app/servicios/pedido.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'app-pedido-listado',
  templateUrl: './pedido-listado.page.html',
  styleUrls: ['./pedido-listado.page.scss'],
})
export class PedidoListadoPage implements OnInit {

  public cargando = true;
  public listaPedido: any;
  public mostrarListaMovil = false;

  constructor(
    private actionSheetController: ActionSheetController,
    private servicioPedido: PedidoService,
    private servicioUsuario: UsuarioService,
    private servicioAlerta: AlertaService,
    private modalController: ModalController,
    private platform: Platform,
    private router: Router,
  ) {
    this.verificarResolucion();
  }

  async ngOnInit() {
    await this.obtenerPedidos();

    this.platform.resize
    .subscribe(() => {
      this.verificarResolucion();
    });
  }

  verificarResolucion() {
    const width = this.platform.width();
    this.mostrarListaMovil = (width > 991) ? false : true;
  }

  async obtenerPedidos() {
    const usuario: any = await this.servicioUsuario.obtenerUsuario();
    if (usuario) {
      const parametros = {
        id_usuario: usuario.identificador
      };

      const response: any = await this.servicioPedido.obtenerPedido(null, parametros);
      if (response.success) {
        this.listaPedido = response.data;
      } else {
        this.cargando = false;
        this.servicioAlerta.dialogoError(response.message);
        this.router.navigate(['/']);
      }

      this.cargando = false;
    } else { this.router.navigate(['/']); }
  }

  async mostrarOpciones(pedido) {
    // if (this.platform.is('cordova')) {
      const botones = [
        {
          text: 'Ver productos',
          icon: 'eye',
          handler: () => {
            this.obtenerItems(pedido.identificador);
          }
        }
      ];

      if (!pedido.pagos || pedido.pagos && pedido.pagos.estado == 'PENDIENTE') {
        if (pedido.pagos.vr_tipo != 'PERC' && pedido.pagos.vr_tipo != 'PCTCD') {
          botones.push({
            text: 'Finalizar pedido',
            icon: 'card',
            handler: () => {
              this.finalizarPedido(pedido);
            }
          });
        }

        // if (pedido.pagos.vr_tipo != 'PO' && pedido.pagos.vr_tipo != 'ATCD') {
          botones.push({
            text: 'Cancelar pedido',
            icon: 'close',
            handler: () => {
              this.cancelarPedido(pedido);
            }
          });
        // }
      }

      const actionSheet = await this.actionSheetController.create({
        header: 'Opciones',
        buttons: botones
      });

      await actionSheet.present();
    // }
  }

  async obtenerItems(id_pedido) {
    this.cargando = true;

    const parametros = {
      id_pedido
    };
    const response: any = await this.servicioPedido.obtenerItems(parametros);
    if (response.success) {
      const modal = await this.modalController.create({
        component: DetallePedidoModalComponent,
        componentProps: {
          listaItems: response.data
        }
      });

      await modal.present();
    } else {
      this.cargando = false;
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

  finalizarPedido(id_pedido) {
    this.router.navigate(['/pedido'], {queryParams: {pedido: id_pedido}});
  }

  async cancelarPedido(id_pedido) {
    this.cargando = true;

    const response: any = await this.servicioPedido.cancelar(id_pedido);

    if (response.success) {
      this.servicioAlerta.dialogoExito(response.message);
      this.obtenerPedidos();
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }

}
