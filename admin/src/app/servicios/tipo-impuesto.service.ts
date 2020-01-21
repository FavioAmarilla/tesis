import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioTipoImpuesto {

  constructor(
    private http: HttpClient
  ) { }

  async obtenerImpuesto(id?) {
    const url = (id) ? `${API}/tipoImpuesto/show/${id}` : `${API}/tipoImpuesto`;
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

  async registrar(tipoImpuesto) {
    const json = JSON.stringify(tipoImpuesto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}/tipoImpuesto`, params, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async actualizar(tipoImpuesto, id) {
    const json = JSON.stringify(tipoImpuesto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.put(`${API}/tipoImpuesto/update/${id}`, params, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async paginacion(pagina = '') {
    let url = `${API}/tipoImpuesto/paginate`;
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

}
