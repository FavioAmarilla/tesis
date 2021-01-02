import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends BaseService {

  recurso = "pedido";

  public async cambiarEstado(estado, id) {
    this.token = await this.servicioUsuario.obtenerToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .append('Authorization', this.token);

    let data = {
      estado
    };

    return new Promise(resolve => {
      this.http.post(`${API}/${this.recurso}/${id}/estado`, data, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async devolucion(id, usr) {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: {
        devolucion: true,
        usr: usr
      }
    }

    return new Promise(resolve => {
      this.http.delete(`${API}/pedido/${id}`, options).subscribe(
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
