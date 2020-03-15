import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const API: string = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioLineaProducto {

  constructor(
    private http: HttpClient
  ) { }

  async obtenerLinea(id?, pagina?) {
    let url = (id) ? `${API}/lineaProducto/${id}` : `${API}/lineaProducto`;
    url = (pagina) ? `${url}?page=${pagina}` : url;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.get(url, { headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async registrar(lineaProducto) {
    const json = JSON.stringify(lineaProducto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}/lineaProducto`, params, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async actualizar(lineaProducto, id) {
    const json = JSON.stringify(lineaProducto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.put(`${API}/lineaProducto/${id}`, params, { headers: headers }).subscribe(
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
