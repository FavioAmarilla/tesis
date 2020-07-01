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
    const token = await this.storage.get('token');

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', token);
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
    const token = await this.storage.get('token');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', token);
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
    const token = await this.storage.get('token');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .append('Authorization', token);

    return new Promise(resolve => {
      this.http.post(`${API}pedido`, pedido, { headers }).subscribe(
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
    const token = await this.storage.get('token');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .append('Authorization', token);

    return new Promise(resolve => {
      this.http.put(`${API}pedido/${id}`, pedido, { headers }).subscribe(
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
    const token = await this.storage.get('token');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .append('Authorization', token);

    return new Promise(resolve => {
      this.http.delete(`${API}pedido/${id}`, { headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }
}
