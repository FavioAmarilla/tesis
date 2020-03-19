import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioPais {

  constructor(
    private http: HttpClient
  ) { }

  async obtenerPais(id?, parametros?) {
    const url = (id) ? `${API}/pais/${id}` : `${API}/pais`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(url, { headers, params }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async registrar(pais) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}/pais`, pais, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async actualizar(pais, id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.put(`${API}/pais/${id}`, pais, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }
}
