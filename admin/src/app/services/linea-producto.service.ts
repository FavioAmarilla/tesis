import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from 'environments/environment';

const API: string = environment.api;

@Injectable({
  providedIn: 'root'
})
export class LineaProductoService {

  constructor(
    private http: HttpClient
  ) { }

  async getLinea(id?) {
    const url = (id) ? `${API}/lineaProducto/show/${id}` : `${API}/lineaProducto`;
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

  async register(lineaProducto) {
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

  async update(lineaProducto, id) {
    const json = JSON.stringify(lineaProducto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.put(`${API}/lineaProducto/update/${id}`, params, { headers: headers }).subscribe(
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
