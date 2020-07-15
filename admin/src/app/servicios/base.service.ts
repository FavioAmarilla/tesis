import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ServicioUsuario } from './usuario.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  public recurso: string = '';
  public token: string = '';

  constructor(
    public http: HttpClient,
    public servicioUsuario: ServicioUsuario
  ) {
  }

  public async obtener(id?, parametros?) {
    const url = (id) ? `${API}/${this.recurso}/${id}` : `${API}/${this.recurso}`;

    this.token = await this.servicioUsuario.obtenerToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', this.token);
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(url, { headers, params }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  public async registrar(data) {
    this.token = await this.servicioUsuario.obtenerToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .append('Authorization', this.token);;

    return new Promise(resolve => {
      this.http.post(`${API}/${this.recurso}`, data, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  public async actualizar(data, id) {
    this.token = await this.servicioUsuario.obtenerToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .append('Authorization', this.token);;

    return new Promise(resolve => {
      this.http.put(`${API}/${this.recurso}/${id}`, data, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async eliminar(id) {
    this.token = await this.servicioUsuario.obtenerToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .append('Authorization', this.token);;

    return new Promise(resolve => {
      this.http.delete(`${API}/${this.recurso}/${id}`, { headers: headers }).subscribe(
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
