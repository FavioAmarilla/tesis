import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioEmpresa {

  constructor(
    private http: HttpClient
  ) { }

  async obtenerEmpresa(id?, parametros?) {
    const url = (id) ? `${API}/empresa/${id}` : `${API}/empresa`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({fromObject: parametros});

    return new Promise(resolve => {
      this.http.get(url, {params}).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async registrar(empresa) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}/empresa`, empresa, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async actualizar(empresa, id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.put(`${API}/empresa/${id}`, empresa, { headers: headers }).subscribe(
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
