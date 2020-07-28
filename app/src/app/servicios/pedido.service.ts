import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async obtenerPedido(id?, parametros?) {
    const url = (id) ? `pedido/${id}` : `pedido`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(`${API}${url}`, { headers, params }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async obtenerItems(parametros?) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(`${API}pedidoItems`, { headers, params }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async registrar(pedido) {
    return new Promise(resolve => {
      this.http.post(`${API}pedido`, pedido).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async actualizar(pedido, id) {
    return new Promise(resolve => {
      this.http.put(`${API}pedido/${id}`, pedido).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async cancelar(id) {
    return new Promise(resolve => {
      this.http.delete(`${API}pedido/${id}`).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async pagarConTarjetaAgregada(id) {
    return new Promise(resolve => {
      this.http.post(`${API}pedido/${id}/ultimatarjeta`, {}).subscribe(
        (response: any) => { resolve(response); },
        error => { resolve(error.error); }
      );
    });
  }
}
