import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cliente } from '../interfaces/interfaces';

const API = environment.api;
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(
    private http: HttpClient
  ) { }

  async obtenerClientes(id?, parametros?) {
    const url = (id) ? `cliente/${id}` : `cliente`;

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

  async registro(cliente: Cliente) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}cliente`, cliente, { headers })
        .subscribe(
          (response: any) => resolve(response),
          (error: any) => resolve(error.error)
        );
    });
  }

  async actualizar(cliente: Cliente, id: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.put(`${API}cliente/${id}`, cliente, { headers })
        .subscribe(
          (response: any) => resolve(response),
          (error: any) => resolve(error.error)
        );
    });
  }


}
