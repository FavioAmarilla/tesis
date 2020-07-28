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

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
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
    return new Promise(resolve => {
      this.http.post(`${API}/${this.recurso}`, data).subscribe(
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
    return new Promise(resolve => {
      this.http.put(`${API}/${this.recurso}/${id}`, data).subscribe(
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
    return new Promise(resolve => {
      this.http.delete(`${API}/${this.recurso}/${id}`).subscribe(
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
